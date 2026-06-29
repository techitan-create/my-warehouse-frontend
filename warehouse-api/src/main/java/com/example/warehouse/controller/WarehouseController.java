package com.example.warehouse.controller;

import com.example.warehouse.entity.Warehouse;
import com.example.warehouse.exception.DuplicateResourceException;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.repository.WarehouseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "จัดการคลังสินค้า")
@SecurityRequirement(name = "Bearer")
public class WarehouseController {

    private final WarehouseRepository warehouseRepository;

    @GetMapping
    @Operation(summary = "ดูคลังสินค้าทั้งหมด")
    public ResponseEntity<List<Warehouse>> getAll() {
        return ResponseEntity.ok(warehouseRepository.findAll());
    }

    @PostMapping
    @Operation(summary = "เพิ่มคลังสินค้าใหม่")
    public ResponseEntity<Warehouse> create(
            @RequestParam String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        if (warehouseRepository.existsByName(name))
            throw new DuplicateResourceException("ชื่อคลังนี้มีอยู่แล้ว");
        Warehouse w = new Warehouse();
        w.setName(name);
        w.setLocation(location);
        w.setCapacity(capacity);
        return ResponseEntity.status(201)
            .body(warehouseRepository.save(w));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "ลบคลังสินค้า")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        warehouseRepository.findById(id).orElseThrow(() ->
            new ResourceNotFoundException("ไม่พบคลัง ID: " + id));
        warehouseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}