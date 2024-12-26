package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.BookStatus;
import com.cgi.library.dto.CheckOutDto;
import com.cgi.library.repository.BookRepository;
import com.cgi.library.repository.CheckOutRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
public class CheckOutService {

    @Autowired
    private CheckOutRepository checkOutRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public Page<CheckOutDto> getCheckOuts(String search, Pageable pageable) {
        Page<CheckOut> checkOuts;
        if (search != null && !search.trim().isEmpty()) {
            checkOuts = checkOutRepository.searchByBorrowerName(search.trim(), pageable);
        } else {
            checkOuts = checkOutRepository.findAll(pageable);
        }
        return checkOuts.map(checkOut -> modelMapper.map(checkOut, CheckOutDto.class));
    }

    public CheckOutDto saveCheckOut(CheckOutDto CheckOutDto) {
        CheckOut checkOut = modelMapper.map(CheckOutDto, CheckOut.class);

        Book book = bookRepository.findById(checkOut.getBorrowedBook().getId())
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));

        if (checkOut.getId() == null) {
            // New checkout
            if (book.getStatus() != BookStatus.AVAILABLE) {
                throw new IllegalStateException("Book is not available for checkout");
            }

            checkOut.setBorrowedBook(book);

            book.setStatus(BookStatus.BORROWED);
            book.setDueDate(checkOut.getDueDate());
            book.setCheckOutCount(book.getCheckOutCount() + 1);
        } else {
            // Existing checkout - handle return
            CheckOut existingCheckOut = checkOutRepository.findById(checkOut.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Checkout not found"));

            if (checkOut.getReturnedDate() != null && existingCheckOut.getReturnedDate() == null) {
                book.setStatus(BookStatus.RETURNED);
                book.setDueDate(null);
            }
        }
        checkOutRepository.save(checkOut);
        bookRepository.save(book);
        CheckOut savedCheckOut = checkOutRepository.save(checkOut);
        return modelMapper.map(savedCheckOut, CheckOutDto.class);

    }

    public CheckOutDto getCheckOut(UUID checkOutId) {
        CheckOut checkOut = checkOutRepository.findById(checkOutId)
                .orElseThrow(() -> new EntityNotFoundException("Checkout not found with id: " + checkOutId));
        return modelMapper.map(checkOut, CheckOutDto.class);
    }

    public CheckOutDto updateCheckOut(UUID checkOutId) {
        CheckOut existingCheckOut = checkOutRepository.findById(checkOutId)
                .orElseThrow(() -> new EntityNotFoundException("Checkout not found with id: " + checkOutId));

        Book book = existingCheckOut.getBorrowedBook();
        if (book == null) {
            throw new EntityNotFoundException("Book not found for checkout");
        }
        // Validate if the book exists
        //Book book = bookRepository.findById(checkOutDto.getBorrowedBook().getId())
        //        .orElseThrow(() -> new EntityNotFoundException("Book not found"));

        CheckOutDto checkOutDto = modelMapper.map(existingCheckOut, CheckOutDto.class);
        checkOutDto.setReturnedDate(LocalDate.now());

        // Store original checkOutDate since it shouldn't change
        LocalDate originalCheckOutDate = existingCheckOut.getCheckedOutDate();
        LocalDate originalReturnDate = existingCheckOut.getReturnedDate();

        // Map the updated data
        modelMapper.map(checkOutDto, existingCheckOut);
        existingCheckOut.setId(checkOutId);
        existingCheckOut.setCheckedOutDate(originalCheckOutDate);
        existingCheckOut.setBorrowedBook(book);

        // Handle book status changes if this is a return operation
        if (originalReturnDate == null) {
            book.setStatus(BookStatus.AVAILABLE);
            book.setDueDate(null);
            bookRepository.save(book);
        }
        CheckOut savedCheckOut = checkOutRepository.save(existingCheckOut);
        return modelMapper.map(savedCheckOut, CheckOutDto.class);
    }

    public CheckOutDto extendDueDate(UUID checkOutId, int days) {
        CheckOut existingCheckOut = checkOutRepository.findById(checkOutId)
                .orElseThrow(() -> new EntityNotFoundException("Checkout not found with id: " + checkOutId));

        Book book = existingCheckOut.getBorrowedBook();
        if (book == null) {
            throw new EntityNotFoundException("Book not found for checkout");
        }

        if (existingCheckOut.getReturnedDate() != null) {
            throw new IllegalStateException("Cannot extend due date for returned book");
        }

        // Extend due date for both checkout and book
        LocalDate newDueDate = existingCheckOut.getDueDate().plusDays(days);
        existingCheckOut.setDueDate(newDueDate);
        book.setDueDate(newDueDate);

        // Save both entities
        bookRepository.save(book);
        CheckOut savedCheckOut = checkOutRepository.save(existingCheckOut);

        return modelMapper.map(savedCheckOut, CheckOutDto.class);
    }

    public void deleteCheckOut(UUID checkOutId) {
        CheckOut checkOut = checkOutRepository.findById(checkOutId)
                .orElseThrow(() -> new EntityNotFoundException("Checkout not found"));

        if (checkOut.getReturnedDate() == null) {
            throw new IllegalStateException("Cannot delete an active checkout");
        }

        checkOutRepository.deleteById(checkOutId);
    }
}