package com.example.warehouse.dto.response;

public class InventoryResponseDTO {
    private Long id;
    private String productName;
    private String productSku;
    private String warehouseName;
    private Integer quantity;
    private Integer minStock;
    private Integer maxStock;
    private Boolean isLowStock;

    public Long getId() { return id; }
    public String getProductName() { return productName; }
    public String getProductSku() { return productSku; }
    public String getWarehouseName() { return warehouseName; }
    public Integer getQuantity() { return quantity; }
    public Integer getMinStock() { return minStock; }
    public Integer getMaxStock() { return maxStock; }
    public Boolean getIsLowStock() { return isLowStock; }

    public void setId(Long id) { this.id = id; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setProductSku(String productSku) { this.productSku = productSku; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setMinStock(Integer minStock) { this.minStock = minStock; }
    public void setMaxStock(Integer maxStock) { this.maxStock = maxStock; }
    public void setIsLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; }
}