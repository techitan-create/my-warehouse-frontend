package com.example.warehouse.dto.request;

import com.example.warehouse.entity.StockMove;
import jakarta.validation.constraints.*;

public class StockMoveRequestDTO {

    @NotNull(message = "Product ID ห้ามว่าง")
    private Long productId;

    @NotNull(message = "Warehouse ID ห้ามว่าง")
    private Long warehouseId;

    @NotNull(message = "ประเภทการเคลื่อนไหวห้ามว่าง")
    private StockMove.MoveType type;

    @NotNull(message = "จำนวนห้ามว่าง")
    @Min(value = 1, message = "จำนวนต้องมากกว่า 0")
    private Integer quantity;

    private String note;

    public Long getProductId() { return productId; }
    public Long getWarehouseId() { return warehouseId; }
    public StockMove.MoveType getType() { return type; }
    public Integer getQuantity() { return quantity; }
    public String getNote() { return note; }

    public void setProductId(Long productId) { this.productId = productId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public void setType(StockMove.MoveType type) { this.type = type; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setNote(String note) { this.note = note; }
}