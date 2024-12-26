package com.cgi.library.dto;

import com.cgi.library.model.BookStatus;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;

@Data
public class BookDto {

    private UUID id;

    private String title;

    private String author;

    private String genre;

    private int year;

    private LocalDate added;

    private int checkOutCount;

    private BookStatus status;

    private LocalDate dueDate;

    private String comment;
}
