package com.forja.inventarios;

import com.forja.inventarios.controller.DashboardController;
import com.forja.inventarios.controller.MovementsController;
import com.forja.inventarios.controller.ProductsController;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class App extends Application {

    private StackPane contentArea;
    private Node dashboardView;
    private Node productsView;
    private Node movementsView;
    private DashboardController dashboardController;
    private ProductsController productsController;
    private MovementsController movementsController;

    private Button dashboardBtn;
    private Button productsBtn;
    private Button movementsBtn;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Forja - Gestión de Inventarios");
        primaryStage.setMinWidth(1100);
        primaryStage.setMinHeight(700);

        BorderPane root = new BorderPane();
        root.setStyle("-fx-background-color: #0f172a;");

        root.setLeft(createSidebar());
        root.setCenter(createContentArea());

        Scene scene = new Scene(root);
        scene.getStylesheets().add(getClass().getResource("/styles/theme.css").toExternalForm());

        primaryStage.setScene(scene);
        primaryStage.show();

        showDashboard();
    }

    private VBox createSidebar() {
        VBox sidebar = new VBox();
        sidebar.getStyleClass().add("sidebar");
        sidebar.setStyle("-fx-background-color: #0b1121;");

        Label logo = new Label("◆ FORJA");
        logo.setStyle("-fx-font-size: 20px; -fx-font-weight: bold; -fx-text-fill: #d97706; -fx-padding: 20;");

        Label subtitle = new Label("INVENTARIOS");
        subtitle.setStyle("-fx-font-size: 10px; -fx-text-fill: #64748b; -fx-padding: 0 20 15 20; -fx-letter-spacing: 3;");

        dashboardBtn = createSidebarButton("📊  Dashboard");
        productsBtn = createSidebarButton("📦  Productos");
        movementsBtn = createSidebarButton("📋  Movimientos");

        dashboardBtn.setOnAction(e -> showDashboard());
        productsBtn.setOnAction(e -> showProducts());
        movementsBtn.setOnAction(e -> showMovements());

        VBox nav = new VBox(2, dashboardBtn, productsBtn, movementsBtn);
        nav.setPadding(new Insets(10, 0, 0, 0));

        VBox spacer = new VBox();
        VBox.setVgrow(spacer, Priority.ALWAYS);

        Label version = new Label("v1.0.0");
        version.setStyle("-fx-text-fill: #475569; -fx-padding: 10 20; -fx-font-size: 11px;");

        sidebar.getChildren().addAll(logo, subtitle, nav, spacer, version);
        return sidebar;
    }

    private Button createSidebarButton(String text) {
        Button btn = new Button(text);
        btn.getStyleClass().add("sidebar-btn");
        btn.setMaxWidth(Double.MAX_VALUE);
        return btn;
    }

    private StackPane createContentArea() {
        contentArea = new StackPane();
        contentArea.setStyle("-fx-background-color: #0f172a;");
        return contentArea;
    }

    private void showDashboard() {
        if (dashboardView == null) {
            dashboardController = new DashboardController();
            dashboardView = dashboardController.getView();
        }
        contentArea.getChildren().setAll(dashboardView);
        updateActiveButton(dashboardBtn);
        dashboardController.loadStats();
    }

    private void showProducts() {
        if (productsView == null) {
            productsController = new ProductsController();
            productsView = productsController.getView();
        }
        contentArea.getChildren().setAll(productsView);
        updateActiveButton(productsBtn);
        productsController.loadProducts();
    }

    private void showMovements() {
        if (movementsView == null) {
            movementsController = new MovementsController();
            movementsView = movementsController.getView();
        }
        contentArea.getChildren().setAll(movementsView);
        updateActiveButton(movementsBtn);
        movementsController.loadMovements();
    }

    private void updateActiveButton(Button active) {
        for (Button btn : new Button[]{dashboardBtn, productsBtn, movementsBtn}) {
            btn.getStyleClass().remove("active");
        }
        active.getStyleClass().add("active");
    }

    public static void main(String[] args) {
        launch(args);
    }
}
