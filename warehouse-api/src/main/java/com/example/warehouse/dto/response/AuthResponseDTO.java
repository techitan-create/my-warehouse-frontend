package com.example.warehouse.dto.response;

public class AuthResponseDTO {
    private String token;
    private String username;
    private String role;
    private String message;

    public AuthResponseDTO(String token, String username,
            String role, String message) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.message = message;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}