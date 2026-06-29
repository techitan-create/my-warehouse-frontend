package com.example.warehouse.repository;

import com.example.warehouse.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface ProductRepository extends JpaRepository<Product, Long> {

    Boolean existsBySku(String sku);

    // ค้นหาสินค้าด้วยชื่อหรือ SKU พร้อม Pagination
    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<Product> findBySearchAndCategory(
        @Param("search") String search,
        @Param("categoryId") Long categoryId,
        Pageable pageable
    );
}