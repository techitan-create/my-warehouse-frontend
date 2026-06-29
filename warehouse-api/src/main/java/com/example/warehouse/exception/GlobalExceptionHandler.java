package com.example.warehouse.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest req) {
        return ResponseEntity.status(404).body(buildError(
            404, "Not Found", ex.getMessage(), req.getRequestURI(), null));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(
            DuplicateResourceException ex, HttpServletRequest req) {
        return ResponseEntity.status(409).body(buildError(
            409, "Conflict", ex.getMessage(), req.getRequestURI(), null));
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<Map<String, Object>> handleStock(
            InsufficientStockException ex, HttpServletRequest req) {
        return ResponseEntity.status(409).body(buildError(
            409, "Insufficient Stock", ex.getMessage(), req.getRequestURI(), null));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest req) {
        return ResponseEntity.status(401).body(buildError(
            401, "Unauthorized", "Username หรือ Password ไม่ถูกต้อง",
            req.getRequestURI(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError err : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(err.getField(), err.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(buildError(
            400, "Validation Failed", "กรุณาตรวจสอบข้อมูลที่กรอก",
            req.getRequestURI(), fieldErrors));
    }

    // ดัก Exception ทุกชนิด พร้อม print ชื่อจริงออกมา
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(
            Exception ex, HttpServletRequest req) {
        // print ชื่อ Exception จริงๆ ให้เห็นใน Terminal
        System.out.println("=== EXCEPTION TYPE: " + ex.getClass().getName());
        System.out.println("=== EXCEPTION MSG:  " + ex.getMessage());
        ex.printStackTrace();
        return ResponseEntity.status(500).body(buildError(
            500, "Internal Server Error",
            ex.getClass().getSimpleName() + ": " + ex.getMessage(),
            req.getRequestURI(), null));
    }

    private Map<String, Object> buildError(int status, String error,
            String message, String path, Map<String, String> fieldErrors) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        body.put("path", path);
        if (fieldErrors != null) body.put("fieldErrors", fieldErrors);
        return body;
    }
}