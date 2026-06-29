package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank(message = "Username ห้ามว่าง")
    private String username;

    @NotBlank(message = "Password ห้ามว่าง")
    private String password;

    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
}