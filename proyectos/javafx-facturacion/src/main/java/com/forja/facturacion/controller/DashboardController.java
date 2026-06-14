package com.forja.facturacion.controller;

import com.forja.facturacion.service.DatabaseService;
import javafx.fxml.FXML;
import javafx.scene.text.Text;

import java.text.NumberFormat;
import java.util.Locale;

public class DashboardController {

    @FXML private Text totalClients;
    @FXML private Text totalInvoices;
    @FXML private Text paidTotal;
    @FXML private Text pendingTotal;

    private final DatabaseService db = DatabaseService.getInstance();

    @FXML
    public void initialize() {
        loadStats();
    }

    public void loadStats() {
        NumberFormat fmt = NumberFormat.getNumberInstance(Locale.US);
        fmt.setMinimumFractionDigits(2);
        fmt.setMaximumFractionDigits(2);

        totalClients.setText(String.valueOf(db.getClientCount()));
        totalInvoices.setText(String.valueOf(db.getInvoiceCount()));
        paidTotal.setText("$" + fmt.format(db.getPaidTotal()));
        pendingTotal.setText("$" + fmt.format(db.getPendingTotal()));
    }
}
