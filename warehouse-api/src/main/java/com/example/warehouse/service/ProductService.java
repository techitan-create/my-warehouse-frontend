package com.example.warehouse.service;

import com.example.warehouse.dto.request.ProductRequestDTO;
import com.example.warehouse.dto.response.PageResponseDTO;
import com.example.warehouse.dto.response.ProductResponseDTO;
import com.example.warehouse.entity.Category;
import com.example.warehouse.entity.Product;
import com.example.warehouse.exception.DuplicateResourceException;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.repository.CategoryRepository;
import com.example.warehouse.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ดูสินค้าทั้งหมด พร้อม Pagination และ Filter
    public PageResponseDTO<ProductResponseDTO> getAll(
            int page, int size, String sortBy,
            String search, Long categoryId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
Page<Product> result = (search == null && categoryId == null)
    ? productRepository.findAll(pageable)
    : productRepository.findBySearchAndCategory(search, categoryId, pageable);

        List<ProductResponseDTO> content = result.getContent()
            .stream().map(this::toDTO).toList();

        return new PageResponseDTO<>(
            content, result.getNumber(), result.getSize(),
            result.getTotalElements(), result.getTotalPages(),
            result.isFirst(), result.isLast()
        );
    }

    // ดูสินค้าตาม ID
    public ProductResponseDTO getById(long id) {
        return toDTO(findById(id));
    }

    // เพิ่มสินค้า
    public ProductResponseDTO create(ProductRequestDTO dto) {
        if (productRepository.existsBySku(dto.getSku()))
            throw new DuplicateResourceException(
                "SKU " + dto.getSku() + " มีอยู่แล้ว");

        Product product = new Product();
        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());

        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "ไม่พบหมวดหมู่ ID: " + dto.getCategoryId()));
            product.setCategory(cat);
        }
        return toDTO(productRepository.save(product));
    }

    // แก้ไขสินค้า
    public ProductResponseDTO update(long id, ProductRequestDTO dto) {
        Product product = findById(id);
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());

        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "ไม่พบหมวดหมู่ ID: " + dto.getCategoryId()));
            product.setCategory(cat);
        }
        return toDTO(productRepository.save(product));
    }

    // ลบสินค้า
    public void delete(long id) {
        findById(id);
        productRepository.deleteById(id);
    }

    // helper
    private Product findById(long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "ไม่พบสินค้า ID: " + id));
    }

    private ProductResponseDTO toDTO(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setSku(p.getSku());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStatus(p.getStatus().name());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        if (p.getCategory() != null)
            dto.setCategoryName(p.getCategory().getName());
        return dto;
    }
}