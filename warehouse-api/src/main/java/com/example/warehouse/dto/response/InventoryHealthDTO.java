package com.example.warehouse.dto.response;

import java.util.List;

public class InventoryHealthDTO {

    private int totalProducts;      // สินค้าทั้งหมด
    private int healthyCount;       // สต็อกปกติ
    private int lowStockCount;      // สต็อกต่ำ
    private int criticalCount;      // สต็อกวิกฤต (เหลือ 0)
    private int overstockCount;     // สต็อกเกิน
    private double healthScore;     // คะแนนสุขภาพ 0-100

    private List<InventoryHealthItemDTO> items; // รายละเอียดแต่ละรายการ

    public static class InventoryHealthItemDTO {
        private Long inventoryId;
        private String productName;
        private String productSku;
        private String warehouseName;
        private Integer quantity;
        private Integer minStock;
        private Integer maxStock;
        private String status;      // CRITICAL, LOW, HEALTHY, OVERSTOCK
        private String message;     // ข้อความแนะนำ

        public Long getInventoryId() { return inventoryId; }
        public String getProductName() { return productName; }
        public String getProductSku() { return productSku; }
        public String getWarehouseName() { return warehouseName; }
        public Integer getQuantity() { return quantity; }
        public Integer getMinStock() { return minStock; }
        public Integer getMaxStock() { return maxStock; }
        public String getStatus() { return status; }
        public String getMessage() { return message; }

        public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
        public void setProductName(String productName) { this.productName = productName; }
        public void setProductSku(String productSku) { this.productSku = productSku; }
        public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public void setMinStock(Integer minStock) { this.minStock = minStock; }
        public void setMaxStock(Integer maxStock) { this.maxStock = maxStock; }
        public void setStatus(String status) { this.status = status; }
        public void setMessage(String message) { this.message = message; }
    }

    public int getTotalProducts() { return totalProducts; }
    public int getHealthyCount() { return healthyCount; }
    public int getLowStockCount() { return lowStockCount; }
    public int getCriticalCount() { return criticalCount; }
    public int getOverstockCount() { return overstockCount; }
    public double getHealthScore() { return healthScore; }
    public List<InventoryHealthItemDTO> getItems() { return items; }

    public void setTotalProducts(int totalProducts) { this.totalProducts = totalProducts; }
    public void setHealthyCount(int healthyCount) { this.healthyCount = healthyCount; }
    public void setLowStockCount(int lowStockCount) { this.lowStockCount = lowStockCount; }
    public void setCriticalCount(int criticalCount) { this.criticalCount = criticalCount; }
    public void setOverstockCount(int overstockCount) { this.overstockCount = overstockCount; }
    public void setHealthScore(double healthScore) { this.healthScore = healthScore; }
    public void setItems(List<InventoryHealthItemDTO> items) { this.items = items; }
}