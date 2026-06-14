package com.forja.facturacion.service;

import com.forja.facturacion.model.Client;
import com.forja.facturacion.model.Invoice;
import com.forja.facturacion.model.InvoiceItem;

import java.io.File;
import java.sql.*;
import java.time.LocalDate;
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
            String url = "jdbc:sqlite:" + new File(dbDir, "facturacion.db").getAbsolutePath();
            connection = DriverManager.getConnection(url);
            createTables();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void createTables() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS clients (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  name TEXT NOT NULL," +
                "  email TEXT," +
                "  phone TEXT," +
                "  address TEXT" +
                ")"
            );
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS invoices (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  client_id INTEGER NOT NULL," +
                "  client_name TEXT NOT NULL," +
                "  date TEXT NOT NULL," +
                "  subtotal REAL NOT NULL," +
                "  iva REAL NOT NULL," +
                "  total REAL NOT NULL," +
                "  status TEXT NOT NULL DEFAULT 'pendiente'," +
                "  FOREIGN KEY (client_id) REFERENCES clients(id)" +
                ")"
            );
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS invoice_items (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  invoice_id INTEGER NOT NULL," +
                "  description TEXT NOT NULL," +
                "  quantity INTEGER NOT NULL," +
                "  price REAL NOT NULL," +
                "  FOREIGN KEY (invoice_id) REFERENCES invoices(id)" +
                ")"
            );
        }
    }

    public Connection getConnection() {
        return connection;
    }

    // ==================== CLIENT CRUD ====================

    public List<Client> getAllClients() {
        List<Client> clients = new ArrayList<>();
        String sql = "SELECT * FROM clients ORDER BY name";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                clients.add(mapClient(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return clients;
    }

    public Client getClientById(int id) {
        String sql = "SELECT * FROM clients WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapClient(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void insertClient(Client client) {
        String sql = "INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, client.getName());
            stmt.setString(2, client.getEmail());
            stmt.setString(3, client.getPhone());
            stmt.setString(4, client.getAddress());
            stmt.executeUpdate();
            try (Statement genStmt = connection.createStatement();
                 ResultSet rs = genStmt.executeQuery("SELECT last_insert_rowid()")) {
                if (rs.next()) client.setId(rs.getInt(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateClient(Client client) {
        String sql = "UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, client.getName());
            stmt.setString(2, client.getEmail());
            stmt.setString(3, client.getPhone());
            stmt.setString(4, client.getAddress());
            stmt.setInt(5, client.getId());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteClient(int id) {
        try (PreparedStatement stmt = connection.prepareStatement("DELETE FROM clients WHERE id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Client mapClient(ResultSet rs) throws SQLException {
        return new Client(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("phone"),
            rs.getString("address")
        );
    }

    // ==================== INVOICE CRUD ====================

    public List<Invoice> getAllInvoices() {
        List<Invoice> invoices = new ArrayList<>();
        String sql = "SELECT * FROM invoices ORDER BY id DESC";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Invoice inv = mapInvoice(rs);
                inv.setItems(getInvoiceItems(inv.getId()));
                invoices.add(inv);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return invoices;
    }

    public Invoice getInvoiceById(int id) {
        String sql = "SELECT * FROM invoices WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Invoice inv = mapInvoice(rs);
                    inv.setItems(getInvoiceItems(inv.getId()));
                    return inv;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public int insertInvoice(Invoice invoice) {
        String sql = "INSERT INTO invoices (client_id, client_name, date, subtotal, iva, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, invoice.getClientId());
            stmt.setString(2, invoice.getClientName());
            stmt.setString(3, invoice.getDate().toString());
            stmt.setDouble(4, invoice.getSubtotal());
            stmt.setDouble(5, invoice.getIva());
            stmt.setDouble(6, invoice.getTotal());
            stmt.setString(7, invoice.getStatus());
            stmt.executeUpdate();
            try (Statement genStmt = connection.createStatement();
                 ResultSet rs = genStmt.executeQuery("SELECT last_insert_rowid()")) {
                if (rs.next()) {
                    int invoiceId = rs.getInt(1);
                    for (InvoiceItem item : invoice.getItems()) {
                        item.setInvoiceId(invoiceId);
                        insertInvoiceItem(item);
                    }
                    return invoiceId;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public void updateInvoiceStatus(int id, String status) {
        String sql = "UPDATE invoices SET status = ? WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteInvoice(int id) {
        try (PreparedStatement stmt = connection.prepareStatement("DELETE FROM invoice_items WHERE invoice_id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try (PreparedStatement stmt = connection.prepareStatement("DELETE FROM invoices WHERE id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // ==================== INVOICE ITEMS ====================

    public List<InvoiceItem> getInvoiceItems(int invoiceId) {
        List<InvoiceItem> items = new ArrayList<>();
        String sql = "SELECT * FROM invoice_items WHERE invoice_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, invoiceId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    items.add(mapInvoiceItem(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }

    private void insertInvoiceItem(InvoiceItem item) {
        String sql = "INSERT INTO invoice_items (invoice_id, description, quantity, price) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, item.getInvoiceId());
            stmt.setString(2, item.getDescription());
            stmt.setInt(3, item.getQuantity());
            stmt.setDouble(4, item.getPrice());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Invoice mapInvoice(ResultSet rs) throws SQLException {
        return new Invoice(
            rs.getInt("id"),
            rs.getInt("client_id"),
            rs.getString("client_name"),
            LocalDate.parse(rs.getString("date")),
            rs.getDouble("subtotal"),
            rs.getDouble("iva"),
            rs.getDouble("total"),
            rs.getString("status")
        );
    }

    private InvoiceItem mapInvoiceItem(ResultSet rs) throws SQLException {
        return new InvoiceItem(
            rs.getInt("id"),
            rs.getInt("invoice_id"),
            rs.getString("description"),
            rs.getInt("quantity"),
            rs.getDouble("price")
        );
    }

    // ==================== DASHBOARD STATS ====================

    public int getClientCount() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM clients")) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int getInvoiceCount() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM invoices")) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public double getPaidTotal() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COALESCE(SUM(total), 0) FROM invoices WHERE status = 'pagada'")) {
            if (rs.next()) return rs.getDouble(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public double getPendingTotal() {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COALESCE(SUM(total), 0) FROM invoices WHERE status = 'pendiente'")) {
            if (rs.next()) return rs.getDouble(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
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
