package com.forja.inventarios.service;

import com.forja.inventarios.model.Category;
import com.forja.inventarios.model.Movement;
import com.forja.inventarios.model.Product;

import java.io.File;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DatabaseService {

    private static DatabaseService instance;
    private Connection connection;

    private DatabaseService() {
        initDatabase();
    }

    public static synchronized DatabaseService getInstance() {
        if (instance == null) {
            instance = new DatabaseService();
        }
        return instance;
    }

    private void initDatabase() {
        try {
            String homeDir = System.getProperty("user.home");
            File dbDir = new File(homeDir, ".forja");
            if (!dbDir.exists()) {
                dbDir.mkdirs();
            }
            String url = "jdbc:sqlite:" + new File(dbDir, "inventarios.db").getAbsolutePath();
            connection = DriverManager.getConnection(url);
            createTables();
            seedCategories();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void createTables() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS categories (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  name TEXT NOT NULL UNIQUE" +
                ")"
            );
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS products (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  name TEXT NOT NULL," +
                "  sku TEXT UNIQUE," +
                "  category_id INTEGER," +
                "  price REAL NOT NULL DEFAULT 0," +
                "  stock INTEGER NOT NULL DEFAULT 0," +
                "  minimum_stock INTEGER NOT NULL DEFAULT 0," +
                "  created_at TEXT DEFAULT (datetime('now','localtime'))," +
                "  updated_at TEXT DEFAULT (datetime('now','localtime'))," +
                "  FOREIGN KEY (category_id) REFERENCES categories(id)" +
                ")"
            );
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS movements (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  product_id INTEGER NOT NULL," +
                "  type TEXT NOT NULL," +
                "  quantity INTEGER NOT NULL," +
                "  reason TEXT," +
                "  created_at TEXT DEFAULT (datetime('now','localtime'))," +
                "  FOREIGN KEY (product_id) REFERENCES products(id)" +
                ")"
            );
        }
    }

    private void seedCategories() throws SQLException {
        String[] defaults = {"Electrónica", "Ropa", "Alimentos", "Herramientas", "Oficina", "Otros"};
        for (String name : defaults) {
            try (PreparedStatement stmt = connection.prepareStatement(
                    "INSERT OR IGNORE INTO categories (name) VALUES (?)")) {
                stmt.setString(1, name);
                stmt.executeUpdate();
            }
        }
    }

    public Connection getConnection() {
        return connection;
    }

    // ==================== CATEGORIES ====================

    public List<Category> getAllCategories() {
        List<Category> list = new ArrayList<>();
        String sql = "SELECT * FROM categories ORDER BY name";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(new Category(rs.getInt("id"), rs.getString("name")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public int insertCategory(String name) {
        String sql = "INSERT INTO categories (name) VALUES (?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.executeUpdate();
            try (Statement gen = connection.createStatement();
                 ResultSet rs = gen.executeQuery("SELECT last_insert_rowid()")) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    // ==================== PRODUCTS ====================

    public List<Product> getAllProducts() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT p.*, COALESCE(c.name, 'Sin categoría') AS category_name " +
                     "FROM products p LEFT JOIN categories c ON p.category_id = c.id " +
                     "ORDER BY p.name";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(mapProduct(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Product getProductById(int id) {
        String sql = "SELECT p.*, COALESCE(c.name, 'Sin categoría') AS category_name " +
                     "FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapProduct(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public int insertProduct(Product product) {
        String sql = "INSERT INTO products (name, sku, category_id, price, stock, minimum_stock) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, product.getName());
            stmt.setString(2, product.getSku());
            if (product.getCategoryId() > 0) {
                stmt.setInt(3, product.getCategoryId());
            } else {
                stmt.setNull(3, Types.INTEGER);
            }
            stmt.setDouble(4, product.getPrice());
            stmt.setInt(5, product.getStock());
            stmt.setInt(6, product.getMinimumStock());
            stmt.executeUpdate();
            try (Statement gen = connection.createStatement();
                 ResultSet rs = gen.executeQuery("SELECT last_insert_rowid()")) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public void updateProduct(Product product) {
        String sql = "UPDATE products SET name = ?, sku = ?, category_id = ?, price = ?, " +
                     "stock = ?, minimum_stock = ?, updated_at = datetime('now','localtime') WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, product.getName());
            stmt.setString(2, product.getSku());
            if (product.getCategoryId() > 0) {
                stmt.setInt(3, product.getCategoryId());
            } else {
                stmt.setNull(3, Types.INTEGER);
            }
            stmt.setDouble(4, product.getPrice());
            stmt.setInt(5, product.getStock());
            stmt.setInt(6, product.getMinimumStock());
            stmt.setInt(7, product.getId());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateProductStock(int productId, int newStock) {
        String sql = "UPDATE products SET stock = ?, updated_at = datetime('now','localtime') WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, newStock);
            stmt.setInt(2, productId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteProduct(int id) {
        try (PreparedStatement stmt = connection.prepareStatement("DELETE FROM movements WHERE product_id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try (PreparedStatement stmt = connection.prepareStatement("DELETE FROM products WHERE id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Product mapProduct(ResultSet rs) throws SQLException {
        return new Product(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("sku"),
            rs.getInt("category_id"),
            rs.getString("category_name"),
            rs.getDouble("price"),
            rs.getInt("stock"),
            rs.getInt("minimum_stock"),
            rs.getString("created_at"),
            rs.getString("updated_at")
        );
    }

    // ==================== MOVEMENTS ====================

    public List<Movement> getAllMovements() {
        List<Movement> list = new ArrayList<>();
        String sql = "SELECT m.*, COALESCE(p.name, 'Eliminado') AS product_name " +
                     "FROM movements m LEFT JOIN products p ON m.product_id = p.id " +
                     "ORDER BY m.id DESC";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(new Movement(
                    rs.getInt("id"),
                    rs.getInt("product_id"),
                    rs.getString("product_name"),
                    rs.getString("type"),
                    rs.getInt("quantity"),
                    rs.getString("reason"),
                    rs.getString("created_at")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public void insertMovement(Movement movement) {
        String sql = "INSERT INTO movements (product_id, type, quantity, reason) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, movement.getProductId());
            stmt.setString(2, movement.getType());
            stmt.setInt(3, movement.getQuantity());
            stmt.setString(4, movement.getReason());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // ==================== DASHBOARD STATS ====================

    public int getProductCount() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM products")) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public double getTotalStockValue() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COALESCE(SUM(price * stock), 0) FROM products")) {
            if (rs.next()) return rs.getDouble(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int getLowStockCount() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(
                 "SELECT COUNT(*) FROM products WHERE stock <= minimum_stock")) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int getCategoryCount() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM categories")) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public List<Movement> getRecentMovements(int limit) {
        List<Movement> list = new ArrayList<>();
        String sql = "SELECT m.*, COALESCE(p.name, 'Eliminado') AS product_name " +
                     "FROM movements m LEFT JOIN products p ON m.product_id = p.id " +
                     "ORDER BY m.id DESC LIMIT ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, limit);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(new Movement(
                        rs.getInt("id"),
                        rs.getInt("product_id"),
                        rs.getString("product_name"),
                        rs.getString("type"),
                        rs.getInt("quantity"),
                        rs.getString("reason"),
                        rs.getString("created_at")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
