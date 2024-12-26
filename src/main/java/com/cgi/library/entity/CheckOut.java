package com.cgi.library.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "checkout")
@Getter
@Setter
public class CheckOut {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "varchar(36)")
    private UUID id;

    @NotBlank(message = "Borrower's first name is required")
    @Column(name = "borrower_first_name", nullable = false)
    private String borrowerFirstName;

    @NotBlank(message = "Borrower's last name is required")
    @Column(name = "borrower_last_name", nullable = false)
    private String borrowerLastName;

    @NotNull(message = "Book is required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book borrowedBook;

    @NotNull(message = "Checkout date is required")
    @Column(name = "checked_out_date", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkedOutDate;

    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @Column(name = "returned_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate returnedDate;

    @PrePersist
    protected void onCreate() {
        if (checkedOutDate == null) {
            checkedOutDate = LocalDate.now();
        }
        if (dueDate == null) {
            dueDate = checkedOutDate.plusWeeks(2); // Default loan period of 2 weeks
        }
    }
}