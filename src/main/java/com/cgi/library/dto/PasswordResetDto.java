package com.cgi.library.dto;

import lombok.Data;

@Data
public class PasswordResetDto {
    private String password;
    private String token;
}
