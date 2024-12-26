package com.cgi.library.entity;

import com.cgi.library.model.BookStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "book")
@Getter
@Setter
public class Book {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "UUID", updatable = false)
    private UUID id; //@Column(columnDefinition = "varchar(36)")

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Author is required")
    @Column(nullable = false)
    private String author;

    private String genre;

    @Min(value = 0)
    @Max(value = 9999)
    private Integer year;

    @Column(nullable = false, updatable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate added;

    @Column(name = "check_out_count")
    private Integer checkOutCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status = BookStatus.AVAILABLE;

    @Column(name = "due_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    private String comment;

    @OneToMany(mappedBy = "borrowedBook", cascade = CascadeType.ALL)
    private List<CheckOut> checkOuts = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (added == null) {
            added = LocalDate.now();
        }
    }
}