package com.example.warehouse.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductRequestDTO {

    @NotBlank(message = "ชื่อสินค้าห้ามว่าง")
    @Size(min = 2, max = 100, message = "ชื่อสินค้าต้องมี 2-100 ตัวอักษร")
    private String name;

    @NotBlank(message = "SKU ห้ามว่าง")
    private String sku;

    @NotNull(message = "ราคาห้ามว่าง")
    @DecimalMin(value = "0.01", message = "ราคาต้องมากกว่า 0")
    private BigDecimal price;

    private String description;
    private Long categoryId;

    @Min(value = 0, message = "จำนวนขั้นต่ำห้ามติดลบ")
    private Integer minStock = 0;

    @Max(value = 999999, message = "จำนวนสูงสุดเกินกำหนด")
    private Integer maxStock = 9999;

    public String getName() { return name; }
    public String getSku() { return sku; }
    public BigDecimal getPrice() { return price; }
    public String getDescription() { return description; }
    public Long getCategoryId() { return categoryId; }
    public Integer getMinStock() { return minStock; }
    public Integer getMaxStock() { return maxStock; }

    public void setName(String name) { this.name = name; }
    public void setSku(String sku) { this.sku = sku; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setMinStock(Integer minStock) { this.minStock = minStock; }
    public void setMaxStock(Integer maxStock) { this.maxStock = maxStock; }
}