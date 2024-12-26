package com.cgi.library.controller;

import com.cgi.library.dto.CheckOutDto;
import com.cgi.library.service.CheckOutService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/checkouts")
@Tag(name = "Checkout Management", description = "APIs for managing book checkouts")
public class CheckOutController {

    @Autowired
    private CheckOutService checkOutService;

    @Operation(summary = "Get all checkouts", description = "Returns a paginated list of checkouts")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved checkouts",
                    content = @Content(schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<Page<CheckOutDto>> getCheckOuts(
            @Parameter(description = "Search by borrower first- and lastname")
            @RequestParam(required = false) String search,
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 10, sort = "checkedOutDate") Pageable pageable) {
        return ResponseEntity.ok(checkOutService.getCheckOuts(search, pageable));
    }

    @Operation(summary = "Save checkout",
            description = "Creates a new checkout")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Checkout saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or book not available"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Book or checkout not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<CheckOutDto> saveCheckOut(
            @Parameter(description = "Checkout details", required = true)
            @Valid @RequestBody CheckOutDto CheckOutDto) {
        return ResponseEntity.ok(checkOutService.saveCheckOut(CheckOutDto));
    }

    @Operation(summary = "Get checkout by ID", description = "Returns a single checkout by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved checkout"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Checkout not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("{checkOutId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<CheckOutDto> getCheckOut(
            @Parameter(description = "Checkout ID", required = true)
            @PathVariable("checkOutId") UUID checkOutId) {
        return ResponseEntity.ok(checkOutService.getCheckOut(checkOutId));
    }

    @Operation(summary = "Update checkout", description = "Updates an existing checkout by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Checkout updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or invalid state change"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Checkout not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("{checkOutId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<CheckOutDto> updateCheckOut(
            @Parameter(description = "Checkout ID", required = true)
            @PathVariable UUID checkOutId) {
        CheckOutDto updatedCheckOut = checkOutService.updateCheckOut(checkOutId);
        return ResponseEntity.ok(updatedCheckOut);
    }

    @Operation(summary = "Extend checkout due date",
            description = "Extends the due date of a checkout and associated book by specified number of days")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Due date extended successfully",
                    content = @Content(schema = @Schema(implementation = CheckOutDto.class))),
            @ApiResponse(responseCode = "400", description = "Cannot extend due date for returned book"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Checkout not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{checkOutId}/extend/{days}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<CheckOutDto> extendDueDate(
            @PathVariable UUID checkOutId,
            @PathVariable int days) {
        return ResponseEntity.ok(checkOutService.extendDueDate(checkOutId, days));
    }

    @Operation(summary = "Delete checkout", description = "Deletes a checkout by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Checkout deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Cannot delete active checkout"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Checkout not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("{checkOutId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<String> deleteCheckOut(
            @Parameter(description = "Checkout ID", required = true)
            @PathVariable("checkOutId") UUID checkOutId) {
        checkOutService.deleteCheckOut(checkOutId);
        return ResponseEntity.ok("");
    }
}