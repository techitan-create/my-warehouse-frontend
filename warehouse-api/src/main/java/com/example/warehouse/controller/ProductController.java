package com.example.warehouse.controller;

import com.example.warehouse.dto.request.ProductRequestDTO;
import com.example.warehouse.dto.response.PageResponseDTO;
import com.example.warehouse.dto.response.ProductResponseDTO;
import com.example.warehouse.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "จัดการสินค้า")
@SecurityRequirement(name = "Bearer")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "ดูสินค้าทั้งหมด พร้อม Pagination และ Filter")
    public ResponseEntity<PageResponseDTO<ProductResponseDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(
            productService.getAll(page, size, sortBy, search, categoryId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "ดูสินค้าตาม ID")
    public ResponseEntity<ProductResponseDTO> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    @Operation(summary = "เพิ่มสินค้าใหม่")
    public ResponseEntity<ProductResponseDTO> create(
            @Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.status(201)
            .body(productService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "แก้ไขสินค้า")
    public ResponseEntity<ProductResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "ลบสินค้า")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}