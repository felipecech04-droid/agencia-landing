package com.forja;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;
public class App extends Application {
    public void start(Stage stage) {
        Label l = new Label("Forja - JavaFX funciona!");
        l.setStyle("-fx-font-size: 24; -fx-text-fill: #d97706;");
        Scene s = new Scene(l, 400, 300);
        stage.setScene(s);
        stage.setTitle("Forja Test");
        stage.show();
    }
    public static void main(String[] args) { launch(); }
}
