package com.example.warehouse.controller;

import com.example.warehouse.dto.request.StockMoveRequestDTO;
import com.example.warehouse.dto.response.InventoryResponseDTO;
import com.example.warehouse.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.warehouse.dto.response.InventoryHealthDTO;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "จัดการสต็อกสินค้า")
@SecurityRequirement(name = "Bearer")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "ดูสต็อกสินค้าทั้งหมด")
    public ResponseEntity<List<InventoryResponseDTO>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @GetMapping("/low-stock")
    @Operation(summary = "ดูสินค้าที่สต็อกต่ำกว่าขั้นต่ำ")
    public ResponseEntity<List<InventoryResponseDTO>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStock());
    }

    @PostMapping("/move")
    @Operation(summary = "รับ/จ่าย/โอนสต็อก")
    public ResponseEntity<String> moveStock(
            @Valid @RequestBody StockMoveRequestDTO dto) {
        return ResponseEntity.ok(inventoryService.moveStock(dto));
    }
    @GetMapping("/health")
@Operation(summary = "ตรวจสอบสุขภาพสต็อกทั้งหมด")
public ResponseEntity<InventoryHealthDTO> checkHealth() {
    return ResponseEntity.ok(inventoryService.checkInventoryHealth());
}
}