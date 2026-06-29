package com.example.warehouse.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets; // 1. เพิ่ม Import สำหรับ Charset
import java.security.Key;
import java.util.Date;

@Component
@SuppressWarnings("null") // 2. ปิด Warning เรื่อง Null safety กวนใจในคลาสนี้
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getKey() {
        // 3. ปรับปรุงการ getBytes โดยระบุ UTF_8 เพื่อให้ทำงานเหมือนกันทุก OS
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // สร้าง Token
    public String generateToken(String username, String role) {
        // 4. ดักความปลอดภัยเผื่อลืมตั้งค่า expiration ใน properties (ถ้าไม่มีให้ default เป็น 1 ชม.)
        long jwtExpiration = (expiration != null) ? expiration : 3600000;

        return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    // ดึง Username จาก Token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getKey()).build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    // เช็คว่า Token ยังใช้ได้ไหม
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getKey()).build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}