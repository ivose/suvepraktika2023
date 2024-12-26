package com.cgi.library.controller;

import com.cgi.library.dto.UserDto;
import com.cgi.library.dto.UserDto;
import com.cgi.library.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Management", description = "APIs for managing users in the library")
public class UsersController {

    @Autowired
    private UserService userService;


    @Operation(summary = "Get all users", description = "Returns a paginated list of users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users",
                    content = @Content(schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @Parameter(description = "Search by first- and last name")
            @RequestParam(required = false) String search,
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {

        return ResponseEntity.ok(userService.getUsers(search, pageable));
    }


    @Operation(summary = "Save book", description = "Creates or updates a book")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<UserDto> save(
            @Parameter(description = "User details", required = true)
            @Valid @RequestBody UserDto user) {
        return ResponseEntity.ok(userService.save(user));
    }

    @Operation(summary = "Get user by ID", description = "Returns a single user by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<UserDto> getUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @Operation(summary = "Update user", description = "Updates an existing user by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "Updated user details", required = true)
            @Valid @RequestBody UserDto UserDto) {
        UserDto.setId(userId); // Ensure the ID matches the path variable
        UserDto updatedUser = userService.updateUserByAdm(userId, UserDto);
        return ResponseEntity.ok(updatedUser);
    }


    @Operation(summary = "Delete user", description = "Deletes a user by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @ApiResponse(responseCode = "400", description = "User cannot be deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })

    @DeleteMapping("{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> deleteUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable("userId") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("");
    }

}
