package com.forja.facturacion.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Invoice {
    public static final double IVA_RATE = 0.16;

    private int id;
    private int clientId;
    private String clientName;
    private LocalDate date;
    private double subtotal;
    private double iva;
    private double total;
    private String status;
    private List<InvoiceItem> items;

    public Invoice() {
        this.date = LocalDate.now();
        this.items = new ArrayList<>();
        this.status = "pendiente";
    }

    public Invoice(int id, int clientId, String clientName, LocalDate date,
                   double subtotal, double iva, double total, String status) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.date = date;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
        this.status = status;
        this.items = new ArrayList<>();
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getClientId() { return clientId; }
    public void setClientId(int clientId) { this.clientId = clientId; }
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    public double getIva() { return iva; }
    public void setIva(double iva) { this.iva = iva; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<InvoiceItem> getItems() { return items; }
    public void setItems(List<InvoiceItem> items) { this.items = items; }

    public void calculateTotals() {
        subtotal = items.stream().mapToDouble(InvoiceItem::getSubtotal).sum();
        iva = subtotal * IVA_RATE;
        total = subtotal + iva;
    }
}
