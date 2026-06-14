package com.forja.inventarios.controller;

import com.forja.inventarios.model.Movement;
import com.forja.inventarios.service.DatabaseService;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

import java.text.NumberFormat;
import java.util.Locale;

public class DashboardController {

    private final DatabaseService db = DatabaseService.getInstance();
    private final NumberFormat fmt = NumberFormat.getNumberInstance(Locale.US);

    private Text totalProductsValue;
    private Text totalStockValue;
    private Text lowStockValue;
    private Text categoriesValue;
    private TableView<Movement> recentTable;
    private ObservableList<Movement> movementsData;

    public Node getView() {
        VBox root = new VBox(20);
        root.getStyleClass().add("content-area");
        root.setPadding(new Insets(20, 30, 20, 30));

        VBox header = new VBox(5);
        header.getStyleClass().add("page-header");
        Label title = new Label("Dashboard");
        title.getStyleClass().add("label-title");
        Label subtitle = new Label("Resumen del inventario");
        subtitle.setStyle("-fx-text-fill: #64748b; -fx-font-size: 13px;");
        header.getChildren().addAll(title, subtitle);

        GridPane statsGrid = new GridPane();
        statsGrid.setHgap(15);
        statsGrid.setVgap(15);
        ColumnConstraints col = new ColumnConstraints();
        col.setPercentWidth(25);
        statsGrid.getColumnConstraints().addAll(col, col, col, col);

        statsGrid.add(createStatCard("PRODUCTOS", "#d97706", totalProductsValue = new Text()), 0, 0);
        statsGrid.add(createStatCard("VALOR TOTAL", "#22c55e", totalStockValue = new Text()), 1, 0);
        statsGrid.add(createStatCard("STOCK BAJO", "#ef4444", lowStockValue = new Text()), 2, 0);
        statsGrid.add(createStatCard("CATEGORÍAS", "#3b82f6", categoriesValue = new Text()), 3, 0);

        Label sectionLabel = new Label("MOVIMIENTOS RECIENTES");
        sectionLabel.getStyleClass().add("label-section");

        recentTable = new TableView<>();
        recentTable.setMaxHeight(300);

        TableColumn<Movement, String> colDate = new TableColumn<>("Fecha");
        colDate.setCellValueFactory(new PropertyValueFactory<>("createdAt"));
        colDate.setPrefWidth(160);

        TableColumn<Movement, String> colProduct = new TableColumn<>("Producto");
        colProduct.setCellValueFactory(new PropertyValueFactory<>("productName"));
        colProduct.setPrefWidth(200);

        TableColumn<Movement, String> colType = new TableColumn<>("Tipo");
        colType.setCellValueFactory(new PropertyValueFactory<>("type"));
        colType.setPrefWidth(100);

        TableColumn<Movement, Integer> colQty = new TableColumn<>("Cantidad");
        colQty.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        colQty.setPrefWidth(100);

        TableColumn<Movement, String> colReason = new TableColumn<>("Razón");
        colReason.setCellValueFactory(new PropertyValueFactory<>("reason"));
        colReason.setPrefWidth(250);

        recentTable.getColumns().addAll(colDate, colProduct, colType, colQty, colReason);
        movementsData = FXCollections.observableArrayList();
        recentTable.setItems(movementsData);

        root.getChildren().addAll(header, statsGrid, sectionLabel, recentTable);
        return root;
    }

    private VBox createStatCard(String title, String color, Text value) {
        VBox card = new VBox(5);
        card.getStyleClass().add("card");
        Label lbl = new Label(title);
        lbl.getStyleClass().add("card-title");
        value.getStyleClass().add("card-value");
        value.setStyle("-fx-fill: " + color + ";");
        Label hint = new Label("Actualizado en vivo");
        hint.setStyle("-fx-text-fill: #64748b; -fx-font-size: 11px; -fx-padding: 5 0 0 0;");
        card.getChildren().addAll(lbl, value, hint);
        return card;
    }

    public void loadStats() {
        fmt.setMinimumFractionDigits(2);
        fmt.setMaximumFractionDigits(2);

        totalProductsValue.setText(String.valueOf(db.getProductCount()));
        totalStockValue.setText("$" + fmt.format(db.getTotalStockValue()));
        lowStockValue.setText(String.valueOf(db.getLowStockCount()));
        categoriesValue.setText(String.valueOf(db.getCategoryCount()));

        movementsData.setAll(db.getRecentMovements(20));
    }
}
