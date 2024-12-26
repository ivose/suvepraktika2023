package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.dto.BookDto;
import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.BookStatus;
import com.cgi.library.repository.BookRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public Page<BookDto> getBooks(String search, Pageable pageable) {
        Page<Book> books = (search != null && !search.trim().isEmpty())
                //? bookRepository.findByTitleContainingIgnoreCase(search.trim(), pageable)
                ? bookRepository.searchByTitle(search.trim(), pageable)
                : bookRepository.findAll(pageable);
        return books.map(book -> modelMapper.map(book, BookDto.class));
    }

    @Transactional(readOnly = true)
    public List<BookDto> getAvailableBooks() {
        return bookRepository.findByStatus(BookStatus.AVAILABLE)
                .stream()
                .map(book -> modelMapper.map(book, BookDto.class))
                .collect(Collectors.toList());
    }


    public BookDto saveBook(BookDto bookDto) {
        Book book = modelMapper.map(bookDto, Book.class);

        if (book.getId() != null) {
            // If updating existing book, preserve certain fields
            Book existingBook = bookRepository.findById(book.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + book.getId()));
            book.setCheckOutCount(existingBook.getCheckOutCount());
            book.setCheckOuts(existingBook.getCheckOuts());
        }

        Book savedBook = bookRepository.save(book);
        return modelMapper.map(savedBook, BookDto.class);
    }

    public BookDto updateBook(UUID bookId, BookDto bookDto) {
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        // Preserve data that shouldn't be updated
        LocalDate originalAddedDate = existingBook.getAdded();
        Integer currentCheckOutCount = existingBook.getCheckOutCount();
        BookStatus currentStatus = existingBook.getStatus();
        LocalDate currentDueDate = existingBook.getDueDate();
        List<CheckOut> currentCheckOuts = existingBook.getCheckOuts();

        // Map the updated data
        modelMapper.map(bookDto, existingBook);

        // Restore preserved data
        existingBook.setId(bookId); // Ensure ID doesn't change
        existingBook.setAdded(originalAddedDate);
        existingBook.setCheckOutCount(currentCheckOutCount);
        existingBook.setStatus(currentStatus);
        existingBook.setDueDate(currentDueDate);
        existingBook.setCheckOuts(currentCheckOuts);

        Book savedBook = bookRepository.save(existingBook);
        return modelMapper.map(savedBook, BookDto.class);
    }

    public BookDto getBook(UUID bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        return modelMapper.map(book, BookDto.class);
    }

    public void deleteBook(UUID bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        if (book.getStatus() == BookStatus.BORROWED) {
            throw new IllegalStateException("Cannot delete book while it is checked out");
        }

        bookRepository.deleteById(bookId);
    }
}