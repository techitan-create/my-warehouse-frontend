package com.example.warehouse.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_moves")
public class StockMove {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoveType type;

    @Column(nullable = false)
    private Integer quantity;

    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum MoveType { IN, OUT, TRANSFER }

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public Warehouse getWarehouse() { return warehouse; }
    public MoveType getType() { return type; }
    public Integer getQuantity() { return quantity; }
    public String getNote() { return note; }
    public User getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setProduct(Product product) { this.product = product; }
    public void setWarehouse(Warehouse warehouse) { this.warehouse = warehouse; }
    public void setType(MoveType type) { this.type = type; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setNote(String note) { this.note = note; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}