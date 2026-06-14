package com.forja.facturacion.model;

public class InvoiceItem {
    private int id;
    private int invoiceId;
    private String description;
    private int quantity;
    private double price;

    public InvoiceItem() {}

    public InvoiceItem(int id, int invoiceId, String description, int quantity, double price) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getInvoiceId() { return invoiceId; }
    public void setInvoiceId(int invoiceId) { this.invoiceId = invoiceId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getSubtotal() {
        return quantity * price;
    }
}
