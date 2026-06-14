package com.forja.inventarios;

import javafx.scene.Node;
import javafx.scene.control.Label;

public final class UtilStyles {

    private UtilStyles() {}

    public static Label createCardTitle(String text) {
        Label label = new Label(text);
        label.getStyleClass().add("card-title");
        return label;
    }

    public static void addClass(Node node, String styleClass) {
        node.getStyleClass().add(styleClass);
    }

    public static String inline(String... styles) {
        return String.join("; ", styles);
    }
}
