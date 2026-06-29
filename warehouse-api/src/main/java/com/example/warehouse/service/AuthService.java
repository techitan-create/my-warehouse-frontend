package com.example.warehouse.service;

import com.example.warehouse.dto.request.LoginRequestDTO;
import com.example.warehouse.dto.response.AuthResponseDTO;
import com.example.warehouse.entity.User;
import com.example.warehouse.exception.DuplicateResourceException;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.security.JwtUtil;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // @Lazy บน AuthenticationManager ช่วยแก้ Circular Dependency
    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            @Lazy AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    dto.getUsername(), dto.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(
                "Username หรือ Password ไม่ถูกต้อง");
        }

        User user = userRepository.findByUsername(dto.getUsername()).get();
        String token = jwtUtil.generateToken(
            user.getUsername(), user.getRole().name());
        return new AuthResponseDTO(
            token, user.getUsername(),
            user.getRole().name(), "เข้าสู่ระบบสำเร็จ"
        );
    }

    public String register(String username, String password,
            String email, User.Role role) {
        if (userRepository.existsByUsername(username))
            throw new DuplicateResourceException("Username นี้มีอยู่แล้ว");
        if (userRepository.existsByEmail(email))
            throw new DuplicateResourceException("Email นี้มีอยู่แล้ว");

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role);
        userRepository.save(user);
        return "สร้างผู้ใช้สำเร็จ";
    }
}