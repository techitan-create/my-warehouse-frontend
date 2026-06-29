package com.example.warehouse.service;

import com.example.warehouse.dto.response.InventoryHealthDTO;
import com.example.warehouse.dto.response.InventoryResponseDTO;
import com.example.warehouse.dto.request.StockMoveRequestDTO;
import com.example.warehouse.entity.*;
import com.example.warehouse.exception.*;
import com.example.warehouse.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMoveRepository stockMoveRepository;

    // Constructor แทน @RequiredArgsConstructor
    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            StockMoveRepository stockMoveRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.stockMoveRepository = stockMoveRepository;
    }

    public List<InventoryResponseDTO> getAll() {
        return inventoryRepository.findAll()
            .stream().map(this::toDTO).toList();
    }

    public List<InventoryResponseDTO> getLowStock() {
        return inventoryRepository.findLowStockItems()
            .stream().map(this::toDTO).toList();
    }

    @Transactional
    public String moveStock(StockMoveRequestDTO dto) {
        Inventory inventory = inventoryRepository
            .findByProductAndWarehouseWithLock(
                dto.getProductId(), dto.getWarehouseId())
            .orElseGet(() -> createNewInventory(
                dto.getProductId(), dto.getWarehouseId()));

        if (dto.getType() == StockMove.MoveType.OUT) {
            if (inventory.getQuantity() < dto.getQuantity())
                throw new InsufficientStockException(
                    "สต็อกไม่พอ มีแค่ " + inventory.getQuantity() + " ชิ้น");
            inventory.setQuantity(inventory.getQuantity() - dto.getQuantity());
        } else {
            inventory.setQuantity(inventory.getQuantity() + dto.getQuantity());
        }

        inventoryRepository.save(inventory);

        StockMove move = new StockMove();
        move.setProduct(inventory.getProduct());
        move.setWarehouse(inventory.getWarehouse());
        move.setType(dto.getType());
        move.setQuantity(dto.getQuantity());
        move.setNote(dto.getNote());
        stockMoveRepository.save(move);

        return "บันทึกการเคลื่อนไหวสต็อกสำเร็จ";
    }

    public InventoryHealthDTO checkInventoryHealth() {
        List<Inventory> allInventory = inventoryRepository.findAll();
        List<InventoryHealthDTO.InventoryHealthItemDTO> items = new ArrayList<>();
        int healthy = 0, low = 0, critical = 0, overstock = 0;

        for (Inventory inv : allInventory) {
            InventoryHealthDTO.InventoryHealthItemDTO item =
                new InventoryHealthDTO.InventoryHealthItemDTO();

            item.setInventoryId(inv.getId());
            item.setProductName(inv.getProduct().getName());
            item.setProductSku(inv.getProduct().getSku());
            item.setWarehouseName(inv.getWarehouse().getName());
            item.setQuantity(inv.getQuantity());
            item.setMinStock(inv.getMinStock());
            item.setMaxStock(inv.getMaxStock());

            if (inv.getQuantity() == 0) {
                item.setStatus("CRITICAL");
                item.setMessage("⛔ สต็อกหมดแล้ว! สั่งซื้อด่วน");
                critical++;
            } else if (inv.getQuantity() <= inv.getMinStock()) {
                item.setStatus("LOW");
                item.setMessage("⚠️ สต็อกต่ำกว่าขั้นต่ำ ควรสั่งซื้อเพิ่ม");
                low++;
            } else if (inv.getQuantity() >= inv.getMaxStock()) {
                item.setStatus("OVERSTOCK");
                item.setMessage("📦 สต็อกเกินกำหนด ระวังสินค้าหมดอายุ");
                overstock++;
            } else {
                item.setStatus("HEALTHY");
                item.setMessage("✅ สต็อกอยู่ในระดับปกติ");
                healthy++;
            }
            items.add(item);
        }

        double score = 0;
        int total = allInventory.size();
        if (total > 0) {
            score = Math.round(((double) healthy / total) * 100.0);
        }

        InventoryHealthDTO result = new InventoryHealthDTO();
        result.setTotalProducts(total);
        result.setHealthyCount(healthy);
        result.setLowStockCount(low);
        result.setCriticalCount(critical);
        result.setOverstockCount(overstock);
        result.setHealthScore(score);
        result.setItems(items);

        return result;
    }

private Inventory createNewInventory(long productId, long warehouseId) {
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException(
            "ไม่พบสินค้า ID: " + productId));
    Warehouse warehouse = warehouseRepository.findById(warehouseId)
        .orElseThrow(() -> new ResourceNotFoundException(
            "ไม่พบคลัง ID: " + warehouseId));

    Inventory inv = new Inventory();
    inv.setProduct(product);
    inv.setWarehouse(warehouse);
    inv.setQuantity(0);

    // ดึง minStock และ maxStock จาก Product มาใส่ด้วย
    // ต้องเพิ่ม minStock และ maxStock ใน Product entity ก่อน
    // ถ้าไม่มีใน Product ให้ใช้ค่า default
    inv.setMinStock(0);
    inv.setMaxStock(9999);

    return inventoryRepository.save(inv);
}

    private InventoryResponseDTO toDTO(Inventory i) {
        InventoryResponseDTO dto = new InventoryResponseDTO();
        dto.setId(i.getId());
        dto.setProductName(i.getProduct().getName());
        dto.setProductSku(i.getProduct().getSku());
        dto.setWarehouseName(i.getWarehouse().getName());
        dto.setQuantity(i.getQuantity());
        dto.setMinStock(i.getMinStock());
        dto.setMaxStock(i.getMaxStock());
        dto.setIsLowStock(i.getQuantity() <= i.getMinStock());
        return dto;
    }
}