package com.cgi.library.dto;

import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;

@Data
public class CheckOutDto {
    private UUID id;

    private String borrowerFirstName;

    private String borrowerLastName;

    private BookDto borrowedBook;

    private LocalDate checkedOutDate;

    private LocalDate dueDate;

    private LocalDate returnedDate;

}
