package com.forja.facturacion.controller;

import com.forja.facturacion.model.Client;
import com.forja.facturacion.model.Invoice;
import com.forja.facturacion.model.InvoiceItem;
import com.forja.facturacion.service.DatabaseService;
import com.forja.facturacion.util.PDFExporter;

import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.control.cell.TextFieldTableCell;
import javafx.scene.layout.*;
import javafx.util.converter.IntegerStringConverter;
import javafx.util.converter.DoubleStringConverter;

import java.io.File;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

public class InvoicesController {

    @FXML private TableView<Invoice> invoiceTable;
    @FXML private TableColumn<Invoice, Number> colInvId;
    @FXML private TableColumn<Invoice, String> colInvClient;
    @FXML private TableColumn<Invoice, String> colInvDate;
    @FXML private TableColumn<Invoice, Number> colInvSubtotal;
    @FXML private TableColumn<Invoice, Number> colInvIva;
    @FXML private TableColumn<Invoice, Number> colInvTotal;
    @FXML private TableColumn<Invoice, String> colInvStatus;

    private final DatabaseService db = DatabaseService.getInstance();
    private final ObservableList<Invoice> invoiceList = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        NumberFormat fmt = NumberFormat.getNumberInstance(Locale.US);
        fmt.setMinimumFractionDigits(2);
        fmt.setMaximumFractionDigits(2);

        colInvId.setCellValueFactory(data -> new SimpleIntegerProperty(data.getValue().getId()));
        colInvClient.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getClientName()));
        colInvDate.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getDate().toString()));
        colInvSubtotal.setCellValueFactory(data -> new SimpleDoubleProperty(data.getValue().getSubtotal()));
        colInvIva.setCellValueFactory(data -> new SimpleDoubleProperty(data.getValue().getIva()));
        colInvTotal.setCellValueFactory(data -> new SimpleDoubleProperty(data.getValue().getTotal()));
        colInvStatus.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getStatus()));

        colInvSubtotal.setCellFactory(col -> new CurrencyCell());
        colInvIva.setCellFactory(col -> new CurrencyCell());
        colInvTotal.setCellFactory(col -> new CurrencyCell());
        colInvStatus.setCellFactory(col -> new StatusCell());

        invoiceTable.setItems(invoiceList);
        loadInvoices();

        invoiceTable.setRowFactory(tv -> {
            TableRow<Invoice> row = new TableRow<>();
            row.setOnMouseClicked(event -> {
                if (event.getClickCount() == 2 && !row.isEmpty()) {
                    showInvoiceDetail(row.getItem());
                }
            });
            return row;
        });
    }

    public void loadInvoices() {
        invoiceList.setAll(db.getAllInvoices());
    }

    @FXML
    private void handleNewInvoice() {
        Invoice invoice = showInvoiceDialog();
        if (invoice != null) {
            db.insertInvoice(invoice);
            loadInvoices();
        }
    }

    @FXML
    private void handleMarkPaid() {
        Invoice selected = invoiceTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Seleccione una factura.");
            return;
        }
        if ("pagada".equals(selected.getStatus())) {
            showWarning("La factura ya está pagada.");
            return;
        }
        if ("cancelada".equals(selected.getStatus())) {
            showWarning("No se puede pagar una factura cancelada.");
            return;
        }
        db.updateInvoiceStatus(selected.getId(), "pagada");
        loadInvoices();
    }

    @FXML
    private void handleExport() {
        Invoice selected = invoiceTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Seleccione una factura para exportar.");
            return;
        }
        try {
            File docsDir = new File(System.getProperty("user.home"), "Documents");
            File exportDir = new File(docsDir, "Forja Facturas");
            File file = PDFExporter.exportInvoice(selected, exportDir);
            Alert info = new Alert(Alert.AlertType.INFORMATION);
            info.setTitle("Exportado");
            info.setHeaderText(null);
            info.setContentText("Factura exportada a:\n" + file.getAbsolutePath());
            info.showAndWait();
        } catch (IOException e) {
            showError("Error al exportar: " + e.getMessage());
        }
    }

    @FXML
    private void handleDeleteInvoice() {
        Invoice selected = invoiceTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Seleccione una factura para eliminar.");
            return;
        }
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
        confirm.setTitle("Eliminar Factura");
        confirm.setHeaderText("¿Eliminar factura #" + selected.getId() + "?");
        confirm.setContentText("Esta acción no se puede deshacer.");
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                db.deleteInvoice(selected.getId());
                loadInvoices();
            }
        });
    }

    private void showInvoiceDetail(Invoice invoice) {
        Invoice full = db.getInvoiceById(invoice.getId());
        if (full == null) return;

        Dialog<Void> dialog = new Dialog<>();
        dialog.setTitle("Factura #" + full.getId());
        dialog.setHeaderText(null);

        ButtonType closeBtn = new ButtonType("Cerrar", ButtonBar.ButtonData.CANCEL_CLOSE);
        dialog.getDialogPane().getButtonTypes().add(closeBtn);

        NumberFormat fmt = NumberFormat.getNumberInstance(Locale.US);
        fmt.setMinimumFractionDigits(2);
        fmt.setMaximumFractionDigits(2);

        VBox content = new VBox(8);
        content.setPadding(new Insets(20));
        content.setStyle("-fx-background-color: #1e293b;");

        Label title = new Label("FACTURA #" + full.getId());
        title.setStyle("-fx-font-size: 20px; -fx-font-weight: bold; -fx-text-fill: #d97706;");
        Label clientLabel = new Label("Cliente: " + full.getClientName());
        clientLabel.setStyle("-fx-text-fill: #e2e8f0; -fx-font-size: 14px;");
        Label dateLabel = new Label("Fecha: " + full.getDate());
        dateLabel.setStyle("-fx-text-fill: #94a3b8;");

        Separator sep1 = new Separator();

        VBox itemsBox = new VBox(4);
        itemsBox.setPadding(new Insets(5, 0, 5, 0));
        for (InvoiceItem item : full.getItems()) {
            Label itemLabel = new Label(String.format("%s  x%d  $%.2f",
                item.getDescription(), item.getQuantity(), item.getPrice()));
            itemLabel.setStyle("-fx-text-fill: #e2e8f0;");
            itemsBox.getChildren().add(itemLabel);
        }

        Separator sep2 = new Separator();

        Label subtotalLbl = new Label("Subtotal: $" + fmt.format(full.getSubtotal()));
        subtotalLbl.setStyle("-fx-text-fill: #94a3b8;");
        Label ivaLbl = new Label("IVA (16%): $" + fmt.format(full.getIva()));
        ivaLbl.setStyle("-fx-text-fill: #94a3b8;");
        Label totalLbl = new Label("TOTAL: $" + fmt.format(full.getTotal()));
        totalLbl.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #d97706;");

        Label statusLbl = new Label("Estado: " + full.getStatus().toUpperCase());
        statusLbl.setStyle("-fx-text-fill: " +
            ("pagada".equals(full.getStatus()) ? "#22c55e" :
             "cancelada".equals(full.getStatus()) ? "#ef4444" : "#d97706") +
            "; -fx-font-weight: bold; -fx-font-size: 14px;");

        content.getChildren().addAll(title, clientLabel, dateLabel, sep1, itemsBox, sep2,
            subtotalLbl, ivaLbl, totalLbl, statusLbl);

        dialog.getDialogPane().setContent(content);
        dialog.showAndWait();
    }

    private Invoice showInvoiceDialog() {
        Dialog<Invoice> dialog = new Dialog<>();
        dialog.setTitle("Nueva Factura");
        dialog.setHeaderText(null);

        ButtonType saveBtn = new ButtonType("Crear Factura", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveBtn, ButtonType.CANCEL);

        // Client selector
        ComboBox<Client> clientCombo = new ComboBox<>();
        clientCombo.setItems(FXCollections.observableArrayList(db.getAllClients()));
        clientCombo.setPromptText("Seleccione un cliente");
        clientCombo.setPrefWidth(350);

        // Items table (editable)
        TableView<InvoiceItem> itemsTable = new TableView<>();
        itemsTable.setEditable(true);
        itemsTable.setPrefHeight(200);

        TableColumn<InvoiceItem, String> colDesc = new TableColumn<>("Descripción");
        colDesc.setPrefWidth(200);
        colDesc.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getDescription()));
        colDesc.setCellFactory(TextFieldTableCell.forTableColumn());
        colDesc.setOnEditCommit(e -> e.getRowValue().setDescription(e.getNewValue()));

        TableColumn<InvoiceItem, Integer> colQty = new TableColumn<>("Cant.");
        colQty.setPrefWidth(70);
        colQty.setCellValueFactory(d -> new SimpleIntegerProperty(d.getValue().getQuantity()).asObject());
        colQty.setCellFactory(TextFieldTableCell.forTableColumn(new IntegerStringConverter()));
        colQty.setOnEditCommit(e -> e.getRowValue().setQuantity(e.getNewValue()));

        TableColumn<InvoiceItem, Double> colPrice = new TableColumn<>("Precio");
        colPrice.setPrefWidth(100);
        colPrice.setCellValueFactory(d -> new SimpleDoubleProperty(d.getValue().getPrice()).asObject());
        colPrice.setCellFactory(TextFieldTableCell.forTableColumn(new DoubleStringConverter()));
        colPrice.setOnEditCommit(e -> e.getRowValue().setPrice(e.getNewValue()));

        TableColumn<InvoiceItem, Number> colSubtotal = new TableColumn<>("Subtotal");
        colSubtotal.setPrefWidth(100);
        colSubtotal.setCellValueFactory(d -> new SimpleDoubleProperty(d.getValue().getSubtotal()));

        itemsTable.getColumns().addAll(colDesc, colQty, colPrice, colSubtotal);

        ObservableList<InvoiceItem> itemList = FXCollections.observableArrayList();
        itemsTable.setItems(itemList);

        // Buttons for items
        Button addItemBtn = new Button("+ Agregar Concepto");
        addItemBtn.setStyle("-fx-background-color: #334155; -fx-text-fill: white; -fx-padding: 6 14; -fx-background-radius: 6;");
        addItemBtn.setOnAction(e -> {
            InvoiceItem item = new InvoiceItem();
            item.setDescription("");
            item.setQuantity(1);
            item.setPrice(0);
            itemList.add(item);
        });

        Button removeItemBtn = new Button("Eliminar Concepto");
        removeItemBtn.setStyle("-fx-background-color: #dc2626; -fx-text-fill: white; -fx-padding: 6 14; -fx-background-radius: 6;");
        removeItemBtn.setOnAction(e -> {
            InvoiceItem selected = itemsTable.getSelectionModel().getSelectedItem();
            if (selected != null) itemList.remove(selected);
        });

        HBox itemButtons = new HBox(10, addItemBtn, removeItemBtn);
        itemButtons.setPadding(new Insets(5, 0, 0, 0));

        VBox form = new VBox(10);
        form.setPadding(new Insets(20));
        form.getChildren().addAll(
            new Label("Cliente:"),
            clientCombo,
            new Label("Conceptos:"),
            itemsTable,
            itemButtons
        );

        ScrollPane scrollPane = new ScrollPane(form);
        scrollPane.setFitToWidth(true);
        scrollPane.setStyle("-fx-background-color: #1e293b; -fx-background: #1e293b;");

        dialog.getDialogPane().setContent(scrollPane);
        dialog.getDialogPane().setStyle("-fx-background-color: #1e293b;");

        dialog.setResultConverter(dialogBtn -> {
            if (dialogBtn == saveBtn) {
                Client client = clientCombo.getValue();
                if (client == null) {
                    showWarning("Seleccione un cliente.");
                    return null;
                }
                if (itemList.isEmpty()) {
                    showWarning("Agregue al menos un concepto.");
                    return null;
                }
                for (InvoiceItem item : itemList) {
                    if (item.getDescription().isBlank()) {
                        showWarning("Todos los conceptos deben tener descripción.");
                        return null;
                    }
                    if (item.getQuantity() <= 0) {
                        showWarning("La cantidad debe ser mayor a 0.");
                        return null;
                    }
                    if (item.getPrice() <= 0) {
                        showWarning("El precio debe ser mayor a 0.");
                        return null;
                    }
                }
                Invoice inv = new Invoice();
                inv.setClientId(client.getId());
                inv.setClientName(client.getName());
                inv.setItems(itemList);
                inv.calculateTotals();
                inv.setStatus("pendiente");
                return inv;
            }
            return null;
        });

        return dialog.showAndWait().orElse(null);
    }

    private void showWarning(String message) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle("Aviso");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Error");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    // Custom cell factories
    static class CurrencyCell extends TableCell<Invoice, Number> {
        private final NumberFormat fmt = NumberFormat.getNumberInstance(Locale.US);
        {
            fmt.setMinimumFractionDigits(2);
            fmt.setMaximumFractionDigits(2);
        }
        @Override
        protected void updateItem(Number item, boolean empty) {
            super.updateItem(item, empty);
            if (empty || item == null) {
                setText(null);
            } else {
                setText("$" + fmt.format(item.doubleValue()));
                setStyle("-fx-text-fill: #e2e8f0;");
            }
        }
    }

    static class StatusCell extends TableCell<Invoice, String> {
        @Override
        protected void updateItem(String item, boolean empty) {
            super.updateItem(item, empty);
            if (empty || item == null) {
                setText(null);
                setGraphic(null);
            } else {
                Label badge = new Label(item.toUpperCase());
                String color;
                switch (item) {
                    case "pagada": color = "#22c55e"; break;
                    case "cancelada": color = "#ef4444"; break;
                    default: color = "#d97706"; break;
                }
                badge.setStyle(
                    "-fx-background-color: rgba(" + hexToRgb(color) + ", 0.2);" +
                    "-fx-text-fill: " + color + ";" +
                    "-fx-padding: 4 12;" +
                    "-fx-background-radius: 20;" +
                    "-fx-font-weight: bold;" +
                    "-fx-font-size: 12px;"
                );
                setGraphic(badge);
            }
        }

        private String hexToRgb(String hex) {
            int r = Integer.parseInt(hex.substring(1, 3), 16);
            int g = Integer.parseInt(hex.substring(3, 5), 16);
            int b = Integer.parseInt(hex.substring(5, 7), 16);
            return r + "," + g + "," + b;
        }
    }
}
