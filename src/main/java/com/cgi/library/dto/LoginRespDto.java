package com.cgi.library.dto;

import lombok.Data;

@Data
public class LoginRespDto {
    private String token;
    private UserDto user;
}
