package com.example.warehouse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantity = 0;

    private Integer minStock = 0;
    private Integer maxStock = 9999;

    @Version
    private Long version;

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public Warehouse getWarehouse() { return warehouse; }
    public Integer getQuantity() { return quantity; }
    public Integer getMinStock() { return minStock; }
    public Integer getMaxStock() { return maxStock; }

    public void setId(Long id) { this.id = id; }
    public void setProduct(Product product) { this.product = product; }
    public void setWarehouse(Warehouse warehouse) { this.warehouse = warehouse; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setMinStock(Integer minStock) { this.minStock = minStock; }
    public void setMaxStock(Integer maxStock) { this.maxStock = maxStock; }
}