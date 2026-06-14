package com.forja.facturacion.util;

import com.forja.facturacion.model.Invoice;
import com.forja.facturacion.model.InvoiceItem;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

public class PDFExporter {

    private PDFExporter() {}

    public static File exportInvoice(Invoice invoice, File outputDir) throws IOException {
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        String fileName = String.format("factura_%04d_%s.txt", invoice.getId(), invoice.getDate().toString());
        File file = new File(outputDir, fileName);

        try (PrintWriter pw = new PrintWriter(file, StandardCharsets.UTF_8.name())) {
            pw.println("========================================");
            pw.println("           FORJA FACTURACIÓN");
            pw.println("========================================");
            pw.println();
            pw.println("  FACTURA #" + invoice.getId());
            pw.println("  Fecha: " + invoice.getDate());
            pw.println("  Cliente: " + invoice.getClientName());
            pw.println("----------------------------------------");
            pw.println("  CONCEPTOS:");
            pw.println("----------------------------------------");

            pw.printf("  %-30s %5s %10s%n", "Descripción", "Cant.", "Precio");
            pw.println("  " + "-".repeat(50));
            for (InvoiceItem item : invoice.getItems()) {
                pw.printf("  %-30s %5d %10.2f%n",
                    item.getDescription(), item.getQuantity(), item.getPrice());
            }

            pw.println();
            pw.println("  " + "-".repeat(50));
            pw.printf("  %-40s %10.2f%n", "Subtotal:", invoice.getSubtotal());
            pw.printf("  %-40s %10.2f%n", "IVA (16%):", invoice.getIva());
            pw.printf("  %-40s %10.2f%n", "TOTAL:", invoice.getTotal());
            pw.println("  " + "-".repeat(50));
            pw.println();
            pw.println("  Estado: " + invoice.getStatus().toUpperCase());
            pw.println();
            pw.println("========================================");
            pw.println("     Gracias por su preferencia");
            pw.println("========================================");
        }

        return file;
    }
}
