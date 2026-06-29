package com.example.warehouse.controller;

import com.example.warehouse.dto.request.LoginRequestDTO;
import com.example.warehouse.dto.response.AuthResponseDTO;
import com.example.warehouse.entity.User;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Login และสมัครสมาชิก")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    // Constructor Injection แทน @RequiredArgsConstructor
    public AuthController(AuthService authService,
            UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    @Operation(summary = "เข้าสู่ระบบ รับ JWT Token")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    @Operation(summary = "สร้างผู้ใช้ใหม่")
    public ResponseEntity<String> register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String email,
            @RequestParam(defaultValue = "STAFF") User.Role role) {
        return ResponseEntity.ok(
            authService.register(username, password, email, role));
    }

    @GetMapping("/users")
    @Operation(summary = "ดู User ทั้งหมด (Admin เท่านั้น)")
    @SecurityRequirement(name = "Bearer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{username}/role")
    @Operation(summary = "เปลี่ยน Role ของ User (Admin เท่านั้น)")
    @SecurityRequirement(name = "Bearer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeRole(
            @PathVariable String username,
            @RequestParam User.Role role) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException(
                "ไม่พบ User: " + username));
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok("เปลี่ยน Role สำเร็จ: " + role);
    }
}