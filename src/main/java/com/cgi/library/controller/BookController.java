package com.cgi.library.controller;

import com.cgi.library.dto.BookDto;
import com.cgi.library.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Book Management", description = "APIs for managing books in the library")
public class BookController {

    @Autowired
    private BookService bookService;

    @Operation(summary = "Get all books", description = "Returns a paginated list of books")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved books",
                    content = @Content(schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<Page<BookDto>> getBooks(
            @Parameter(description = "Search by title")
            @RequestParam(required = false) String search,
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 10, sort = "title") Pageable pageable) {
        return ResponseEntity.ok(bookService.getBooks(search, pageable));
    }

    @Operation(summary = "Get available books", description = "Returns a list of books with AVAILABLE status")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Successfully retrieved available books",
                    content = @Content(schema = @Schema(implementation = BookDto.class, type = "array"))
            ),
            @ApiResponse( responseCode = "403", description = "Forbidden - Requires ADMIN or LIBRARIAN role"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<List<BookDto>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @Operation(summary = "Save book", description = "Creates or updates a book")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<BookDto> saveBook(
            @Parameter(description = "Book details", required = true)
            @Valid @RequestBody BookDto book) {
        return ResponseEntity.ok(bookService.saveBook(book));
    }

    @Operation(summary = "Get book by ID", description = "Returns a single book by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved book"),
            @ApiResponse(responseCode = "404", description = "Book not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<BookDto> getBook(
            @Parameter(description = "Book ID", required = true)
            @PathVariable("bookId") UUID bookId) {
        return ResponseEntity.ok(bookService.getBook(bookId));
    }

    @Operation(summary = "Update book", description = "Updates an existing book by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Book not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<BookDto> updateBook(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId,
            @Parameter(description = "Updated book details", required = true)
            @Valid @RequestBody BookDto bookDto) {
        bookDto.setId(bookId); // Ensure the ID matches the path variable
        BookDto updatedBook = bookService.updateBook(bookId, bookDto);
        return ResponseEntity.ok(updatedBook);
    }


    @Operation(summary = "Delete book", description = "Deletes a book by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Book cannot be deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Book not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })

    @DeleteMapping("{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<String> deleteBook(
            @Parameter(description = "Book ID", required = true)
            @PathVariable("bookId") UUID bookId) {
        bookService.deleteBook(bookId);
        return ResponseEntity.ok("");
    }
}