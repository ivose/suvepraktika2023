package com.cgi.library.dto;

import lombok.Data;

@Data
public class SignupDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}
