package com.example.warehouse.security;

import com.example.warehouse.entity.User;
import com.example.warehouse.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;


@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtUtil jwtUtil,
            UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

// เปลี่ยนจาก .orElseThrow เป็นสมัครให้อัตโนมัติแบบนี้ (ตัวอย่างคอนเซปต์)
User user = userRepository.findByEmail(email)
    .orElseGet(() -> {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(oAuth2User.getAttribute("name")); // ดึงชื่อจาก Google
        newUser.setRole(User.Role.STAFF); // กำหนด Role เริ่มต้น (เช็คชื่อ Enum ของคุณด้วยนะครับ)
        return userRepository.save(newUser);
    });

        // สร้าง JWT Token
        String token = jwtUtil.generateToken(
            user.getUsername(), user.getRole().name());

        // Redirect ไป Frontend พร้อม Token และ Role
        response.sendRedirect(frontendUrl +
            "/oauth2/callback?token=" + token +
            "&role=" + user.getRole().name() +
            "&username=" + user.getUsername());
    }
}