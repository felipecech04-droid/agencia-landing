package com.forja.inventarios.model;

public class Product {
    private int id;
    private String name;
    private String sku;
    private int categoryId;
    private String categoryName;
    private double price;
    private int stock;
    private int minimumStock;
    private String createdAt;
    private String updatedAt;

    public Product() {}

    public Product(int id, String name, String sku, int categoryId, String categoryName,
                   double price, int stock, int minimumStock, String createdAt, String updatedAt) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.price = price;
        this.stock = stock;
        this.minimumStock = minimumStock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public boolean isLowStock() {
        return stock <= minimumStock;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public int getMinimumStock() { return minimumStock; }
    public void setMinimumStock(int minimumStock) { this.minimumStock = minimumStock; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return name + " (" + sku + ")";
    }
}
