package com.example.warehouse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private Integer capacity;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}