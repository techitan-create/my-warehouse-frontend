package com.example.warehouse.repository;

import com.example.warehouse.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;


public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // ดึงสต็อกพร้อมล็อกแถว ป้องกัน Race Condition
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.warehouse.id = :warehouseId")
    Optional<Inventory> findByProductAndWarehouseWithLock(
        @Param("productId") Long productId,
        @Param("warehouseId") Long warehouseId
    );

    // หาสินค้าที่สต็อกต่ำกว่าขั้นต่ำ
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minStock")
    List<Inventory> findLowStockItems();

    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);
}