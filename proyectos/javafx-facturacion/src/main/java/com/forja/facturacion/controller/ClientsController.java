package com.forja.facturacion.controller;

import com.forja.facturacion.model.Client;
import com.forja.facturacion.service.DatabaseService;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.geometry.Insets;

public class ClientsController {

    @FXML private TableView<Client> clientTable;
    @FXML private TableColumn<Client, Number> colId;
    @FXML private TableColumn<Client, String> colName;
    @FXML private TableColumn<Client, String> colEmail;
    @FXML private TableColumn<Client, String> colPhone;
    @FXML private TableColumn<Client, String> colAddress;

    private final DatabaseService db = DatabaseService.getInstance();
    private final ObservableList<Client> clientList = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        colId.setCellValueFactory(data -> new SimpleIntegerProperty(data.getValue().getId()));
        colName.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getName()));
        colEmail.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getEmail()));
        colPhone.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getPhone()));
        colAddress.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getAddress()));

        clientTable.setItems(clientList);
        loadClients();
    }

    public void loadClients() {
        clientList.setAll(db.getAllClients());
    }

    @FXML
    private void handleNewClient() {
        Client client = showClientDialog(null);
        if (client != null) {
            db.insertClient(client);
            loadClients();
        }
    }

    @FXML
    private void handleEditClient() {
        Client selected = clientTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Seleccione un cliente para editar.");
            return;
        }
        Client updated = showClientDialog(selected);
        if (updated != null) {
            updated.setId(selected.getId());
            db.updateClient(updated);
            loadClients();
        }
    }

    @FXML
    private void handleDeleteClient() {
        Client selected = clientTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Seleccione un cliente para eliminar.");
            return;
        }
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
        confirm.setTitle("Eliminar Cliente");
        confirm.setHeaderText("¿Eliminar " + selected.getName() + "?");
        confirm.setContentText("Esta acción no se puede deshacer.");
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                db.deleteClient(selected.getId());
                loadClients();
            }
        });
    }

    private Client showClientDialog(Client existing) {
        Dialog<Client> dialog = new Dialog<>();
        dialog.setTitle(existing == null ? "Nuevo Cliente" : "Editar Cliente");
        dialog.setHeaderText(null);

        ButtonType saveBtn = new ButtonType("Guardar", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveBtn, ButtonType.CANCEL);

        TextField nameField = new TextField();
        nameField.setPromptText("Nombre completo");
        TextField emailField = new TextField();
        emailField.setPromptText("correo@ejemplo.com");
        TextField phoneField = new TextField();
        phoneField.setPromptText("+52 555 123 4567");
        TextField addressField = new TextField();
        addressField.setPromptText("Calle, Colonia, Ciudad");

        if (existing != null) {
            nameField.setText(existing.getName());
            emailField.setText(existing.getEmail());
            phoneField.setText(existing.getPhone());
            addressField.setText(existing.getAddress());
        }

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.setPadding(new Insets(20));
        grid.add(new Label("Nombre:"), 0, 0);
        grid.add(nameField, 1, 0);
        grid.add(new Label("Email:"), 0, 1);
        grid.add(emailField, 1, 1);
        grid.add(new Label("Teléfono:"), 0, 2);
        grid.add(phoneField, 1, 2);
        grid.add(new Label("Dirección:"), 0, 3);
        grid.add(addressField, 1, 3);

        dialog.getDialogPane().setContent(grid);
        dialog.getDialogPane().setStyle("-fx-background-color: #1e293b;");

        nameField.requestFocus();

        dialog.setResultConverter(dialogBtn -> {
            if (dialogBtn == saveBtn) {
                if (nameField.getText().isBlank()) {
                    showWarning("El nombre es obligatorio.");
                    return null;
                }
                Client c = new Client();
                c.setName(nameField.getText().trim());
                c.setEmail(emailField.getText().trim());
                c.setPhone(phoneField.getText().trim());
                c.setAddress(addressField.getText().trim());
                return c;
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
}
