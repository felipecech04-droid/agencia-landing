package com.forja.inventarios.controller;

import com.forja.inventarios.model.Category;
import com.forja.inventarios.model.Product;
import com.forja.inventarios.service.DatabaseService;
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

import java.util.Optional;

public class ProductsController {

    private final DatabaseService db = DatabaseService.getInstance();
    private TableView<Product> table;
    private ObservableList<Product> data;

    public Node getView() {
        VBox root = new VBox(15);
        root.getStyleClass().add("content-area");
        root.setPadding(new Insets(20, 30, 20, 30));

        VBox header = new VBox(5);
        header.getStyleClass().add("page-header");
        Label title = new Label("Productos");
        title.getStyleClass().add("label-title");
        Label subtitle = new Label("Gestión de productos del inventario");
        subtitle.setStyle("-fx-text-fill: #64748b; -fx-font-size: 13px;");
        header.getChildren().addAll(title, subtitle);

        HBox toolbar = new HBox(10);
        toolbar.getStyleClass().add("toolbar");

        Button btnNew = new Button("+ Nuevo Producto");
        btnNew.getStyleClass().addAll("btn-primary", "btn-small");
        btnNew.setOnAction(e -> showProductDialog(null));

        Button btnEdit = new Button("Editar");
        btnEdit.getStyleClass().addAll("btn-secondary", "btn-small");
        btnEdit.setOnAction(e -> {
            Product selected = table.getSelectionModel().getSelectedItem();
            if (selected != null) showProductDialog(selected);
            else showAlert("Selecciona un producto para editar.");
        });

        Button btnDelete = new Button("Eliminar");
        btnDelete.getStyleClass().addAll("btn-danger", "btn-small");
        btnDelete.setOnAction(e -> deleteProduct());

        toolbar.getChildren().addAll(btnNew, btnEdit, btnDelete);

        table = new TableView<>();
        table.setRowFactory(tv -> new TableRow<Product>() {
            @Override
            protected void updateItem(Product item, boolean empty) {
                super.updateItem(item, empty);
                if (item != null && item.isLowStock()) {
                    if (!getStyleClass().contains("low-stock")) getStyleClass().add("low-stock");
                } else {
                    getStyleClass().remove("low-stock");
                }
            }
        });

        TableColumn<Product, Integer> colId = new TableColumn<>("ID");
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colId.setPrefWidth(50);

        TableColumn<Product, String> colName = new TableColumn<>("Nombre");
        colName.setCellValueFactory(new PropertyValueFactory<>("name"));
        colName.setPrefWidth(200);

        TableColumn<Product, String> colSku = new TableColumn<>("SKU");
        colSku.setCellValueFactory(new PropertyValueFactory<>("sku"));
        colSku.setPrefWidth(120);

        TableColumn<Product, String> colCategory = new TableColumn<>("Categoría");
        colCategory.setCellValueFactory(new PropertyValueFactory<>("categoryName"));
        colCategory.setPrefWidth(130);

        TableColumn<Product, Double> colPrice = new TableColumn<>("Precio");
        colPrice.setCellValueFactory(new PropertyValueFactory<>("price"));
        colPrice.setPrefWidth(100);

        TableColumn<Product, Integer> colStock = new TableColumn<>("Stock");
        colStock.setCellValueFactory(new PropertyValueFactory<>("stock"));
        colStock.setPrefWidth(80);

        TableColumn<Product, Integer> colMin = new TableColumn<>("Stock Mín.");
        colMin.setCellValueFactory(new PropertyValueFactory<>("minimumStock"));
        colMin.setPrefWidth(90);

        table.getColumns().addAll(colId, colName, colSku, colCategory, colPrice, colStock, colMin);
        data = FXCollections.observableArrayList();
        table.setItems(data);
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_ALL_COLUMNS);

        root.getChildren().addAll(header, toolbar, table);
        return root;
    }

    private void showProductDialog(Product existing) {
        Stage dialog = new Stage();
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.setTitle(existing == null ? "Nuevo Producto" : "Editar Producto");

        VBox layout = new VBox(12);
        layout.setPadding(new Insets(20));
        layout.setStyle("-fx-background-color: #1e293b;");

        GridPane grid = new GridPane();
        grid.setHgap(12);
        grid.setVgap(10);

        Label lblName = new Label("Nombre *");
        lblName.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtName = new TextField();
        txtName.setPromptText("Nombre del producto");

        Label lblSku = new Label("SKU");
        lblSku.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtSku = new TextField();
        txtSku.setPromptText("Código SKU");

        Label lblCategory = new Label("Categoría");
        lblCategory.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        ComboBox<Category> cmbCategory = new ComboBox<>();
        cmbCategory.setItems(FXCollections.observableArrayList(db.getAllCategories()));
        cmbCategory.setPromptText("Seleccionar...");
        cmbCategory.setMaxWidth(Double.MAX_VALUE);

        HBox catRow = new HBox(8);
        TextField txtNewCat = new TextField();
        txtNewCat.setPromptText("Nueva categoría");
        Button btnAddCat = new Button("+");
        btnAddCat.getStyleClass().addAll("btn-primary", "btn-small");
        btnAddCat.setOnAction(e -> {
            String name = txtNewCat.getText().trim();
            if (!name.isEmpty()) {
                int id = db.insertCategory(name);
                if (id > 0) {
                    cmbCategory.setItems(FXCollections.observableArrayList(db.getAllCategories()));
                    cmbCategory.getSelectionModel().selectLast();
                    txtNewCat.clear();
                }
            }
        });
        catRow.getChildren().addAll(txtNewCat, btnAddCat);

        Label lblPrice = new Label("Precio *");
        lblPrice.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtPrice = new TextField();
        txtPrice.setPromptText("0.00");

        Label lblStock = new Label("Stock");
        lblStock.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtStock = new TextField();
        txtStock.setPromptText("0");

        Label lblMin = new Label("Stock Mínimo");
        lblMin.setStyle("-fx-text-fill: #94a3b8; -fx-font-size: 12px;");
        TextField txtMin = new TextField();
        txtMin.setPromptText("0");

        grid.add(lblName, 0, 0); grid.add(txtName, 1, 0);
        grid.add(lblSku, 0, 1); grid.add(txtSku, 1, 1);
        grid.add(lblCategory, 0, 2); grid.add(cmbCategory, 1, 2);
        grid.add(new Label(""), 0, 3); grid.add(catRow, 1, 3);
        grid.add(lblPrice, 0, 4); grid.add(txtPrice, 1, 4);
        grid.add(lblStock, 0, 5); grid.add(txtStock, 1, 5);
        grid.add(lblMin, 0, 6); grid.add(txtMin, 1, 6);

        if (existing != null) {
            txtName.setText(existing.getName());
            txtSku.setText(existing.getSku());
            txtPrice.setText(String.valueOf(existing.getPrice()));
            txtStock.setText(String.valueOf(existing.getStock()));
            txtMin.setText(String.valueOf(existing.getMinimumStock()));
            for (Category c : cmbCategory.getItems()) {
                if (c.getId() == existing.getCategoryId()) {
                    cmbCategory.getSelectionModel().select(c);
                    break;
                }
            }
        }

        HBox buttons = new HBox(10);
        buttons.setAlignment(Pos.CENTER_RIGHT);
        Button btnCancel = new Button("Cancelar");
        btnCancel.getStyleClass().addAll("btn-secondary", "btn-small");
        btnCancel.setOnAction(e -> dialog.close());

        Button btnSave = new Button(existing == null ? "Crear" : "Guardar");
        btnSave.getStyleClass().addAll("btn-primary");
        btnSave.setOnAction(e -> {
            if (txtName.getText().trim().isEmpty()) {
                showAlert("El nombre del producto es obligatorio.");
                return;
            }
            double price;
            try {
                price = Double.parseDouble(txtPrice.getText().trim().replace(",", "."));
            } catch (NumberFormatException ex) {
                showAlert("Precio inválido.");
                return;
            }
            int stock = 0, minStock = 0;
            try {
                stock = Integer.parseInt(txtStock.getText().trim().isEmpty() ? "0" : txtStock.getText().trim());
                minStock = Integer.parseInt(txtMin.getText().trim().isEmpty() ? "0" : txtMin.getText().trim());
            } catch (NumberFormatException ex) {
                showAlert("Stock o stock mínimo inválido.");
                return;
            }

            Category cat = cmbCategory.getSelectionModel().getSelectedItem();

            if (existing == null) {
                Product p = new Product();
                p.setName(txtName.getText().trim());
                p.setSku(txtSku.getText().trim());
                p.setCategoryId(cat != null ? cat.getId() : 0);
                p.setPrice(price);
                p.setStock(stock);
                p.setMinimumStock(minStock);
                db.insertProduct(p);
            } else {
                existing.setName(txtName.getText().trim());
                existing.setSku(txtSku.getText().trim());
                existing.setCategoryId(cat != null ? cat.getId() : 0);
                existing.setPrice(price);
                existing.setStock(stock);
                existing.setMinimumStock(minStock);
                db.updateProduct(existing);
            }
            loadProducts();
            dialog.close();
        });

        buttons.getChildren().addAll(btnCancel, btnSave);
        layout.getChildren().addAll(grid, buttons);

        Scene scene = new Scene(layout);
        scene.getStylesheets().add(getClass().getResource("/styles/theme.css").toExternalForm());
        dialog.setScene(scene);
        dialog.setWidth(420);
        dialog.setHeight(400);
        dialog.showAndWait();
    }

    private void deleteProduct() {
        Product selected = table.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Selecciona un producto para eliminar.");
            return;
        }
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
        confirm.setTitle("Confirmar eliminación");
        confirm.setHeaderText("¿Eliminar " + selected.getName() + "?");
        confirm.setContentText("Se eliminarán también todos los movimientos asociados.");
        DialogPane pane = confirm.getDialogPane();
        pane.getStylesheets().add(getClass().getResource("/styles/theme.css").toExternalForm());
        pane.getStyleClass().add("dialog-pane");

        Optional<ButtonType> result = confirm.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            db.deleteProduct(selected.getId());
            loadProducts();
        }
    }

    public void loadProducts() {
        data.setAll(db.getAllProducts());
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
