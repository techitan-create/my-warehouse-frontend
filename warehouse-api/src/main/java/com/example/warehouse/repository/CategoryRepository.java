package com.example.warehouse.repository;

import com.example.warehouse.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;



public interface CategoryRepository extends JpaRepository<Category, Long> {
    Boolean existsByName(String name);
}