package com.forja.inventarios.controller;

import com.forja.inventarios.model.Movement;
import com.forja.inventarios.model.Product;
import com.forja.inventarios.service.DatabaseService;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;

import java.util.List;

public class MovementsController {

    private final DatabaseService db = DatabaseService.getInstance();
    private TableView<Movement> table;
    private ObservableList<Movement> data;

    public Node getView() {
        VBox root = new VBox(15);
        root.getStyleClass().add("content-area");
        root.setPadding(new Insets(20, 30, 20, 30));

        VBox header = new VBox(5);
        header.getStyleClass().add("page-header");
        Label title = new Label("Movimientos");
        title.getStyleClass().add("label-title");
        Label subtitle = new Label("Registro de entradas y salidas de inventario");
        subtitle.setStyle("-fx-text-fill: #64748b; -fx-font-size: 13px;");
        header.getChildren().addAll(title, subtitle);

        HBox toolbar = new HBox(10);
        toolbar.getStyleClass().add("toolbar");

        Button btnEntry = new Button("+ Entrada");
        btnEntry.getStyleClass().addAll("btn-success", "btn-small");
        btnEntry.setOnAction(e -> showMovementDialog("entry"));

        Button btnExit = new Button("- Salida");
        btnExit.getStyleClass().addAll("btn-danger", "btn-small");
        btnExit.setOnAction(e -> showMovementDialog("exit"));

        Button btnRefresh = new Button("Actualizar");
        btnRefresh.getStyleClass().addAll("btn-secondary", "btn-small");
        btnRefresh.setOnAction(e -> loadMovements());

        toolbar.getChildren().addAll(btnEntry, btnExit, btnRefresh);

        table = new TableView<>();

        TableColumn<Movement, String> colDate = new TableColumn<>("Fecha");
        colDate.setCellValueFactory(new PropertyValueFactory<>("createdAt"));
        colDate.setPrefWidth(160);

        TableColumn<Movement, String> colProduct = new TableColumn<>("Producto");
        colProduct.setCellValueFactory(new PropertyValueFactory<>("productName"));
        colProduct.setPrefWidth(200);

        TableColumn<Movement, String> colType = new TableColumn<>("Tipo");
        colType.setCellValueFactory(cellData -> {
            String type = cellData.getValue().getType();
            String label = "entry".equals(type) ? "Entrada" : "Salida";
            return new SimpleStringProperty(label);
        });
        colType.setPrefWidth(100);

        TableColumn<Movement, Integer> colQty = new TableColumn<>("Cantidad");
        colQty.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        colQty.setPrefWidth(100);

        TableColumn<Movement, String> colReason = new TableColumn<>("Razón");
        colReason.setCellValueFactory(new PropertyValueFactory<>("reason"));
        colReason.setPrefWidth(250);

        table.getColumns().addAll(colDate, colProduct, colType, colQty, colReason);
        data = FXCollections.observableArrayList();
        table.setItems(data);
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_ALL_COLUMNS);

        root.getChildren().addAll(header, toolbar, table);
        return root;
    }

    private void showMovementDialog(String type) {
        Stage dialog = new Stage();
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.setTitle("entry".equals(type) ? "Registrar Entrada" : "Registrar Salida");

        VBox layout = new VBox(12);
        layout.setPadding(new Insets(20));
        layout.setStyle("-fx-background-color: #1e293b;");

        GridPane grid = new GridPane();
        grid.setHgap(12);
        grid.setVgap(10);

        List<Product> products = db.getAllProducts();
        if (products.isEmpty()) {
            showAlert("No hay productos registrados. Crea un producto primero.");
            dialog.close();
            return;
        }

        Label lblProduct = new Label("Producto *");
        lblProduct.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        ComboBox<Product> cmbProduct = new ComboBox<>();
        cmbProduct.setItems(FXCollections.observableArrayList(products));
        cmbProduct.setPromptText("Seleccionar producto...");
        cmbProduct.setMaxWidth(Double.MAX_VALUE);

        Label lblType = new Label("Tipo");
        lblType.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        Label lblTypeValue = new Label("entry".equals(type) ? "ENTRADA" : "SALIDA");
        lblTypeValue.setStyle("entry".equals(type)
            ? "-fx-text-fill: #22c55e; -fx-font-weight: bold; -fx-font-size: 14px;"
            : "-fx-text-fill: #ef4444; -fx-font-weight: bold; -fx-font-size: 14px;");

        Label lblQty = new Label("Cantidad *");
        lblQty.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtQty = new TextField();
        txtQty.setPromptText("0");

        Label lblReason = new Label("Razón");
        lblReason.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtReason = new TextField();
        txtReason.setPromptText("Motivo del movimiento");

        Label lblCurrentStock = new Label("");
        lblCurrentStock.setStyle("-fx-text-fill: #64748b; -fx-font-size: 11px;");

        cmbProduct.setOnAction(e -> {
            Product p = cmbProduct.getSelectionModel().getSelectedItem();
            if (p != null) {
                lblCurrentStock.setText("Stock actual: " + p.getStock() + " | Mínimo: " + p.getMinimumStock());
            }
        });

        grid.add(lblProduct, 0, 0); grid.add(cmbProduct, 1, 0);
        grid.add(lblType, 0, 1); grid.add(lblTypeValue, 1, 1);
        grid.add(lblQty, 0, 2); grid.add(txtQty, 1, 2);
        grid.add(lblReason, 0, 3); grid.add(txtReason, 1, 3);
        grid.add(new Label(""), 0, 4); grid.add(lblCurrentStock, 1, 4);

        HBox buttons = new HBox(10);
        buttons.setAlignment(Pos.CENTER_RIGHT);
        Button btnCancel = new Button("Cancelar");
        btnCancel.getStyleClass().addAll("btn-secondary", "btn-small");
        btnCancel.setOnAction(e -> dialog.close());

        Button btnSave = new Button("Registrar");
        btnSave.getStyleClass().addAll("btn-primary");
        btnSave.setOnAction(e -> {
            Product selected = cmbProduct.getSelectionModel().getSelectedItem();
            if (selected == null) {
                showAlert("Selecciona un producto.");
                return;
            }
            int qty;
            try {
                qty = Integer.parseInt(txtQty.getText().trim());
                if (qty <= 0) {
                    showAlert("La cantidad debe ser mayor a cero.");
                    return;
                }
            } catch (NumberFormatException ex) {
                showAlert("Cantidad inválida.");
                return;
            }

            if ("exit".equals(type) && qty > selected.getStock()) {
                showAlert("Stock insuficiente. Disponible: " + selected.getStock());
                return;
            }

            int newStock = "entry".equals(type)
                ? selected.getStock() + qty
                : selected.getStock() - qty;

            Movement movement = new Movement();
            movement.setProductId(selected.getId());
            movement.setType(type);
            movement.setQuantity(qty);
            movement.setReason(txtReason.getText().trim());

            db.insertMovement(movement);
            db.updateProductStock(selected.getId(), newStock);

            loadMovements();
            dialog.close();
        });

        buttons.getChildren().addAll(btnCancel, btnSave);

        layout.getChildren().addAll(grid, buttons);

        Scene scene = new Scene(layout);
        scene.getStylesheets().add(getClass().getResource("/styles/theme.css").toExternalForm());
        dialog.setScene(scene);
        dialog.setWidth(420);
        dialog.setHeight(350);
        dialog.showAndWait();
    }

    public void loadMovements() {
        data.setAll(db.getAllMovements());
    }

    private void showAlert(String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Información");
        alert.setHeaderText(null);
        alert.setContentText(msg);
        DialogPane pane = alert.getDialogPane();
        pane.getStylesheets().add(getClass().getResource("/styles/theme.css").toExternalForm());
        pane.getStyleClass().add("dialog-pane");
        alert.showAndWait();
    }
}
