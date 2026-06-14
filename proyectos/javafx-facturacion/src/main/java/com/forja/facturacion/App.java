package com.forja.facturacion;

import com.forja.facturacion.controller.ClientsController;
import com.forja.facturacion.controller.DashboardController;
import com.forja.facturacion.controller.InvoicesController;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

import java.io.IOException;

public class App extends Application {

    private static final Color DARK_BG = Color.web("#0f172a");
    private static final Color SIDEBAR_BG = Color.web("#0b1121");
    private static final Color AMBER = Color.web("#d97706");

    private StackPane contentArea;
    private Node dashboardView;
    private Node clientsView;
    private Node invoicesView;
    private DashboardController dashboardController;
    private ClientsController clientsController;
    private InvoicesController invoicesController;

    private Button dashboardBtn;
    private Button clientsBtn;
    private Button invoicesBtn;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Forja - Sistema de Facturación");
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

        dashboardBtn = createSidebarButton("📊  Dashboard");
        clientsBtn = createSidebarButton("👥  Clientes");
        invoicesBtn = createSidebarButton("📄  Facturas");

        dashboardBtn.setOnAction(e -> showDashboard());
        clientsBtn.setOnAction(e -> showClients());
        invoicesBtn.setOnAction(e -> showInvoices());

        VBox nav = new VBox(2, dashboardBtn, clientsBtn, invoicesBtn);
        nav.setPadding(new Insets(10, 0, 0, 0));

        VBox spacer = new VBox();
        VBox.setVgrow(spacer, Priority.ALWAYS);

        Label version = new Label("v1.0.0");
        version.setStyle("-fx-text-fill: #475569; -fx-padding: 10 20; -fx-font-size: 11px;");

        sidebar.getChildren().addAll(logo, nav, spacer, version);
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
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/dashboard.fxml"));
                dashboardView = loader.load();
                dashboardController = loader.getController();
            } catch (IOException e) {
                dashboardView = createErrorView("Error loading dashboard");
                e.printStackTrace();
            }
        }
        contentArea.getChildren().setAll(dashboardView);
        updateActiveButton(dashboardBtn);
        if (dashboardController != null) dashboardController.loadStats();
    }

    private void showClients() {
        if (clientsView == null) {
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/clients.fxml"));
                clientsView = loader.load();
                clientsController = loader.getController();
            } catch (IOException e) {
                clientsView = createErrorView("Error loading clients");
                e.printStackTrace();
            }
        }
        contentArea.getChildren().setAll(clientsView);
        updateActiveButton(clientsBtn);
        if (clientsController != null) clientsController.loadClients();
    }

    private void showInvoices() {
        if (invoicesView == null) {
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/invoices.fxml"));
                invoicesView = loader.load();
                invoicesController = loader.getController();
            } catch (IOException e) {
                invoicesView = createErrorView("Error loading invoices");
                e.printStackTrace();
            }
        }
        contentArea.getChildren().setAll(invoicesView);
        updateActiveButton(invoicesBtn);
        if (invoicesController != null) invoicesController.loadInvoices();
    }

    private void updateActiveButton(Button active) {
        for (Button btn : new Button[]{dashboardBtn, clientsBtn, invoicesBtn}) {
            btn.getStyleClass().remove("active");
        }
        active.getStyleClass().add("active");
    }

    private Node createErrorView(String message) {
        Label label = new Label(message);
        label.setStyle("-fx-text-fill: #ef4444; -fx-font-size: 18px;");
        StackPane pane = new StackPane(label);
        pane.setStyle("-fx-background-color: #0f172a;");
        return pane;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
