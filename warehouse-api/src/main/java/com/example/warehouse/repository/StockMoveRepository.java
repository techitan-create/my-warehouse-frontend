package com.example.warehouse.repository;

import com.example.warehouse.entity.StockMove;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



public interface StockMoveRepository extends JpaRepository<StockMove, Long> {

    // ประวัติการเคลื่อนไหวของสินค้าชิ้นนั้น
    Page<StockMove> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    // ประวัติตาม Type (IN/OUT/TRANSFER)
    Page<StockMove> findByTypeOrderByCreatedAtDesc(StockMove.MoveType type, Pageable pageable);
}