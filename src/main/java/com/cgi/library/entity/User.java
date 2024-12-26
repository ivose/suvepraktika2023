package com.cgi.library.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.cgi.library.model.Role;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;
    private String firstName;
    private String lastName;
    private String resetToken;
    private Long resetTokenExpiry;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
}