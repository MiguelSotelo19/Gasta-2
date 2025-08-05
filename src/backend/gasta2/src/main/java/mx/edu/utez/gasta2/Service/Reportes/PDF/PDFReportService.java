package mx.edu.utez.gasta2.Service.Reportes.PDF;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.Arc2D;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
public class PDFReportService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, Color> colorMap = new HashMap<String, Color>() {{
        put("bg-pink-500", new Color(236, 72, 153));
        put("bg-blue-500", new Color(59, 130, 246));
        put("bg-purple-500", new Color(139, 92, 246));
        put("bg-amber-500", new Color(245, 158, 11));
        put("bg-green-500", new Color(34, 197, 94));
        put("bg-red-500", new Color(239, 68, 68));
        put("bg-yellow-500", new Color(234, 179, 8));
        put("bg-neutral-500", new Color(115, 115, 115));
        put("bg-indigo-500", new Color(99, 102, 241));
        put("bg-teal-500", new Color(20, 184, 166));
        put("bg-orange-500", new Color(249, 115, 22));
        put("bg-stone-500", new Color(120, 113, 108));
        put("bg-rose-500", new Color(244, 63, 94));
        put("bg-emerald-500", new Color(16, 185, 129));
        put("bg-cyan-500", new Color(6, 182, 212));
        put("bg-zinc-500", new Color(113, 113, 122));
        put("bg-lime-500", new Color(132, 204, 22));
        put("bg-fuchsia-500", new Color(217, 70, 239));
        put("bg-sky-500", new Color(14, 165, 233));
        put("bg-violet-500", new Color(139, 92, 246));
        put("bg-slate-500", new Color(100, 116, 139));
    }};

    // Colores predefinidos para las líneas de usuarios
    private final Color[] lineColors = {
            new Color(59, 130, 246),   // blue
            new Color(239, 68, 68),    // red
            new Color(34, 197, 94),    // green
            new Color(245, 158, 11),   // amber
            new Color(139, 92, 246),   // purple
            new Color(249, 115, 22),   // orange
            new Color(20, 184, 166),   // teal
            new Color(236, 72, 153),   // pink
    };

    public byte[] generatePDFReport(String jsonData) throws Exception {
        JsonNode data = objectMapper.readTree(jsonData);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument, PageSize.A4);

        // Configurar márgenes
        document.setMargins(40, 40, 40, 40);

        // Fuentes
        PdfFont titleFont = PdfFontFactory.createFont();
        PdfFont headerFont = PdfFontFactory.createFont();
        PdfFont normalFont = PdfFontFactory.createFont();

        // Título principal
        addHeader(document, data, titleFont, headerFont);

        // Estadísticas generales
        addGeneralStats(document, data, headerFont, normalFont);

        // Gráficas
        addCharts(document, data, headerFont, normalFont);

        // Tabla de gastos
        addExpenseTable(document, data, headerFont, normalFont);

        // Resumen por usuario
        addUserSummary(document, data, headerFont, normalFont);

        // Footer
        addFooter(document, normalFont);

        document.close();
        return baos.toByteArray();
    }

    private void addHeader(Document document, JsonNode data, PdfFont titleFont, PdfFont headerFont) {
        // Logo o icono simulado
        Paragraph logoSection = new Paragraph("💰 SISTEMA GASTA-2")
                .setFont(titleFont)
                .setFontSize(20)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(new DeviceRgb(59, 130, 246))
                .setMarginBottom(10);
        document.add(logoSection);

        // Título del reporte
        String nombreEspacio = data.get("nombreEspacio").asText();
        String periodo = data.get("selectedPeriod").asText();
        String periodoTexto = periodo.equals("month") ? "Este mes" : "Últimos dos meses";

        Paragraph title = new Paragraph("Reporte de Gastos - " + nombreEspacio)
                .setFont(titleFont)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(title);

        Paragraph subtitle = new Paragraph("Período: " + periodoTexto)
                .setFont(headerFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(new DeviceRgb(107, 114, 128))
                .setMarginBottom(20);
        document.add(subtitle);

        // Fecha de generación
        String fechaGeneracion = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        Paragraph fecha = new Paragraph("Generado el: " + fechaGeneracion)
                .setFont(headerFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontColor(new DeviceRgb(107, 114, 128))
                .setMarginBottom(20);
        document.add(fecha);

        // Línea separadora
        document.add(new Paragraph("\n"));
    }

    private void addGeneralStats(Document document, JsonNode data, PdfFont headerFont, PdfFont normalFont) {
        Paragraph statsTitle = new Paragraph("📊 ESTADÍSTICAS GENERALES")
                .setFont(headerFont)
                .setFontSize(14)
                .setFontColor(new DeviceRgb(31, 41, 55))
                .setMarginBottom(15);
        document.add(statsTitle);

        // Crear tabla de estadísticas
        Table statsTable = new Table(4);
        statsTable.setWidth(UnitValue.createPercentValue(100));

        // Headers
        String[] headers = {"Total Gastos", "Promedio por Gasto", "Total Registros", "Categorías Activas"};
        String[] icons = {"💵", "📈", "📋", "🏷️"};
        Color[] colors = {
                new Color(59, 130, 246),   // blue
                new Color(34, 197, 94),    // green
                new Color(139, 92, 246),   // purple
                new Color(249, 115, 22)    // orange
        };

        double totalExpenses = data.get("totalExpenses").asDouble();
        double averageExpense = data.get("averageExpense").asDouble();
        int cantPagos = data.get("cantPagos").asInt();
        int categorias = data.get("categoryData").size();

        String[] values = {
                "$" + String.format("%,.0f", totalExpenses),
                "$" + String.format("%,.0f", averageExpense),
                String.valueOf(cantPagos),
                String.valueOf(categorias)
        };

        for (int i = 0; i < 4; i++) {
            Cell cell = new Cell();
            float brightnessFactor = 0.4f;
            cell.setBackgroundColor(new DeviceRgb(
                    (int)(colors[i].getRed() * brightnessFactor),
                    (int)(colors[i].getGreen() * brightnessFactor),
                    (int)(colors[i].getBlue() * brightnessFactor)
            ));
            cell.setBorder(null);
            cell.setPadding(15);

            Paragraph icon = new Paragraph(icons[i])
                    .setFont(normalFont)
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER);

            Paragraph header = new Paragraph(headers[i])
                    .setFont(headerFont)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.WHITE);

            Paragraph value = new Paragraph(values[i])
                    .setFont(headerFont)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.WHITE);

            cell.add(icon);
            cell.add(header);
            cell.add(value);
            statsTable.addCell(cell);
        }

        document.add(statsTable);
        document.add(new Paragraph("\n"));
    }

    private void addCharts(Document document, JsonNode data, PdfFont headerFont, PdfFont normalFont) throws Exception {
        Paragraph chartsTitle = new Paragraph("📊 GRÁFICAS Y ANÁLISIS")
                .setFont(headerFont)
                .setFontSize(14)
                .setFontColor(new DeviceRgb(31, 41, 55))
                .setMarginBottom(15);
        document.add(chartsTitle);

        // Crear tabla para las dos gráficas lado a lado
        Table chartsTable = new Table(2);
        chartsTable.setWidth(UnitValue.createPercentValue(100));

        // Gráfica de pastel (categorías)
        Cell pieChartCell = new Cell();
        pieChartCell.setPadding(10);

        Paragraph pieTitle = new Paragraph("🥧 Distribución por Categorías")
                .setFont(headerFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        pieChartCell.add(pieTitle);

        BufferedImage pieChart = createPieChart(data.get("categoryData"));
        ByteArrayOutputStream pieChartStream = new ByteArrayOutputStream();
        ImageIO.write(pieChart, "PNG", pieChartStream);
        ImageData pieChartImageData = ImageDataFactory.create(pieChartStream.toByteArray());
        Image pieChartImage = new Image(pieChartImageData);
        pieChartImage.setWidth(250);
        pieChartImage.setHeight(200);
        pieChartImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
        pieChartCell.add(pieChartImage);

        // Leyenda del pastel
        addPieChartLegend(pieChartCell, data.get("categoryData"), normalFont);

        // Gráfica de líneas (usuarios)
        Cell lineChartCell = new Cell();
        lineChartCell.setPadding(10);

        Paragraph lineTitle = new Paragraph("📈 Gastos por Usuario en el Tiempo")
                .setFont(headerFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        lineChartCell.add(lineTitle);

        BufferedImage lineChart = createLineChart(data.get("lineData"));
        ByteArrayOutputStream lineChartStream = new ByteArrayOutputStream();
        ImageIO.write(lineChart, "PNG", lineChartStream);
        ImageData lineChartImageData = ImageDataFactory.create(lineChartStream.toByteArray());
        Image lineChartImage = new Image(lineChartImageData);
        lineChartImage.setWidth(250);
        lineChartImage.setHeight(200);
        lineChartImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
        lineChartCell.add(lineChartImage);

        // Leyenda de líneas
        addLineChartLegend(lineChartCell, data.get("lineData"), normalFont);

        chartsTable.addCell(pieChartCell);
        chartsTable.addCell(lineChartCell);

        document.add(chartsTable);
        document.add(new Paragraph("\n"));
    }

    private BufferedImage createPieChart(JsonNode categoryData) {
        int width = 300;
        int height = 250;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();

        // Configurar antialiasing
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Fondo blanco
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, width, height);

        // Dimensiones del círculo
        int diameter = 180;
        int x = (width - diameter) / 2;
        int y = (height - diameter) / 2;

        // Calcular ángulos
        double startAngle = 0;
        int colorIndex = 0;

        for (JsonNode category : categoryData) {
            double percentage = category.get("percentage").asDouble();
            double sweepAngle = (percentage / 100.0) * 360.0;

            String colorClass = category.get("color").asText();
            Color color = colorMap.getOrDefault(colorClass, new Color(107, 114, 128));

            // Dibujar sector
            g2d.setColor(color);
            Arc2D.Double arc = new Arc2D.Double(x, y, diameter, diameter, startAngle, sweepAngle, Arc2D.PIE);
            g2d.fill(arc);

            // Borde del sector
            g2d.setColor(Color.WHITE);
            g2d.setStroke(new BasicStroke(2));
            g2d.draw(arc);

            startAngle += sweepAngle;
            colorIndex++;
        }

        // Borde exterior
        g2d.setColor(new Color(229, 231, 235));
        g2d.setStroke(new BasicStroke(3));
        g2d.draw(new Ellipse2D.Double(x, y, diameter, diameter));

        g2d.dispose();
        return image;
    }

    private BufferedImage createLineChart(JsonNode lineData) {
        int width = 300;
        int height = 250;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();

        // Configurar antialiasing
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Fondo blanco
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, width, height);

        // Márgenes del gráfico
        int margin = 40;
        int chartWidth = width - 2 * margin;
        int chartHeight = height - 2 * margin;

        // Dibujar ejes
        g2d.setColor(new Color(156, 163, 175));
        g2d.setStroke(new BasicStroke(1));

        // Eje Y
        g2d.drawLine(margin, margin, margin, height - margin);
        // Eje X
        g2d.drawLine(margin, height - margin, width - margin, height - margin);

        // Encontrar valores min y max para escalar
        double maxY = 0;
        Date minDate = new Date(Long.MAX_VALUE);
        Date maxDate = new Date(Long.MIN_VALUE);

        for (JsonNode userLine : lineData) {
            JsonNode dataPoints = userLine.get("dataPoints");
            for (JsonNode point : dataPoints) {
                double y = point.get("y").asDouble();
                maxY = Math.max(maxY, y);

                String dateStr = point.get("x").asText();
                try {
                    Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(dateStr);
                    minDate = date.before(minDate) ? date : minDate;
                    maxDate = date.after(maxDate) ? date : maxDate;
                } catch (Exception e) {
                    // Usar fecha actual si hay error
                    Date now = new Date();
                    minDate = now;
                    maxDate = now;
                }
            }
        }

        // Dibujar líneas de cuadrícula
        g2d.setColor(new Color(243, 244, 246));
        for (int i = 1; i <= 4; i++) {
            int y = margin + (chartHeight * i) / 5;
            g2d.drawLine(margin, y, width - margin, y);
        }

        // Dibujar líneas de datos
        int colorIndex = 0;
        for (JsonNode userLine : lineData) {
            Color lineColor = lineColors[colorIndex % lineColors.length];
            g2d.setColor(lineColor);
            g2d.setStroke(new BasicStroke(3, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

            JsonNode dataPoints = userLine.get("dataPoints");
            List<Point> points = new ArrayList<>();

            for (JsonNode point : dataPoints) {
                double y = point.get("y").asDouble();
                String dateStr = point.get("x").asText();

                try {
                    Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(dateStr);

                    // Calcular posición X basada en la fecha
                    long dateDiff = maxDate.getTime() - minDate.getTime();
                    long pointDiff = date.getTime() - minDate.getTime();
                    int x = margin;
                    if (dateDiff > 0) {
                        x = margin + (int) ((pointDiff * chartWidth) / dateDiff);
                    }

                    // Calcular posición Y
                    int yPos = height - margin - (int) ((y / maxY) * chartHeight);

                    points.add(new Point(x, yPos));
                } catch (Exception e) {
                    // Punto en el centro si hay error
                    points.add(new Point(margin + chartWidth / 2, height - margin - chartHeight / 2));
                }
            }

            // Dibujar línea conectando los puntos
            for (int i = 0; i < points.size() - 1; i++) {
                Point p1 = points.get(i);
                Point p2 = points.get(i + 1);
                g2d.drawLine(p1.x, p1.y, p2.x, p2.y);
            }

            // Dibujar puntos
            g2d.setColor(lineColor.darker());
            for (Point p : points) {
                g2d.fillOval(p.x - 4, p.y - 4, 8, 8);
                g2d.setColor(Color.WHITE);
                g2d.fillOval(p.x - 2, p.y - 2, 4, 4);
                g2d.setColor(lineColor.darker());
            }

            colorIndex++;
        }

        // Etiquetas de los ejes
        g2d.setColor(new Color(107, 114, 128));
        g2d.setFont(new Font("Arial", Font.PLAIN, 10));

        // Etiqueta Y (máximo valor)
        String maxYLabel = "$" + String.format("%,.0f", maxY);
        g2d.drawString(maxYLabel, 5, margin + 5);

        // Etiqueta Y (cero)
        g2d.drawString("$0", 5, height - margin + 5);

        g2d.dispose();
        return image;
    }

    private void addPieChartLegend(Cell cell, JsonNode categoryData, PdfFont font) {
        Table legendTable = new Table(1);
        legendTable.setWidth(UnitValue.createPercentValue(100));
        legendTable.setMarginTop(10);

        for (JsonNode category : categoryData) {
            String name = category.get("name").asText();
            int percentage = category.get("percentage").asInt();
            String colorClass = category.get("color").asText();
            Color color = colorMap.getOrDefault(colorClass, new Color(107, 114, 128));

            Cell legendItem = new Cell();
            legendItem.setBorder(null);
            legendItem.setPadding(2);

            Paragraph legendText = new Paragraph("● " + name + " (" + percentage + "%)")
                    .setFont(font)
                    .setFontSize(8)
                    .setFontColor(new DeviceRgb(color.getRed(), color.getGreen(), color.getBlue()));

            legendItem.add(legendText);
            legendTable.addCell(legendItem);
        }

        cell.add(legendTable);
    }

    private void addLineChartLegend(Cell cell, JsonNode lineData, PdfFont font) {
        Table legendTable = new Table(1);
        legendTable.setWidth(UnitValue.createPercentValue(100));
        legendTable.setMarginTop(10);

        int colorIndex = 0;
        for (JsonNode userLine : lineData) {
            String userName = userLine.get("name").asText();
            Color lineColor = lineColors[colorIndex % lineColors.length];

            Cell legendItem = new Cell();
            legendItem.setBorder(null);
            legendItem.setPadding(2);

            Paragraph legendText = new Paragraph("━ " + userName)
                    .setFont(font)
                    .setFontSize(8)
                    .setFontColor(new DeviceRgb(lineColor.getRed(), lineColor.getGreen(), lineColor.getBlue()));

            legendItem.add(legendText);
            legendTable.addCell(legendItem);
            colorIndex++;
        }

        cell.add(legendTable);
    }

    private void addExpenseTable(Document document, JsonNode data, PdfFont headerFont, PdfFont normalFont) {
        Paragraph tableTitle = new Paragraph("📋 DETALLE DE GASTOS")
                .setFont(headerFont)
                .setFontSize(14)
                .setFontColor(new DeviceRgb(31, 41, 55))
                .setMarginBottom(15);
        document.add(tableTitle);

        JsonNode expenseData = data.get("expenseData");

        // Crear tabla de gastos
        Table expenseTable = new Table(6);
        expenseTable.setWidth(UnitValue.createPercentValue(100));

        // Headers
        String[] headers = {"Fecha", "Descripción", "Categoría", "Usuario", "Monto", "Pagado"};
        for (String header : headers) {
            expenseTable.addHeaderCell(createHeaderCell(header, headerFont));
        }

        for (JsonNode expense : expenseData) {
            String date = expense.get("date").asText();
            String description = expense.get("description").asText();
            String category = expense.get("category").asText();
            String user = expense.get("user").asText();
            double amount = expense.get("amount").asDouble();
            boolean status = expense.get("status").asBoolean();
            String colorClass = expense.get("categoryColor").asText();

            // Fecha
            expenseTable.addCell(createDataCell(date, normalFont));

            // Descripción
            expenseTable.addCell(createDataCell(description, normalFont));

            // Categoría con color
            Cell categoryCell = new Cell();
            Color categoryColor = colorMap.getOrDefault(colorClass, new Color(193, 205, 229));
            categoryCell.add(new Paragraph(category)
                    .setFont(normalFont)
                    .setFontSize(9)
                    .setFontColor(new DeviceRgb(categoryColor.getRed(), categoryColor.getGreen(), categoryColor.getBlue())));
            /*categoryCell.setBackgroundColor(new DeviceRgb(
                    (int)(categoryColor.getRed() * 0.1),
                    (int)(categoryColor.getGreen() * 0.1),
                    (int)(categoryColor.getBlue() * 0.1)
            ));*/

            expenseTable.addCell(categoryCell);

            // Usuario
            expenseTable.addCell(createDataCell(user, normalFont));

            // Monto
            expenseTable.addCell(createDataCell("$" + String.format("%,.0f", amount), normalFont));

            // Estado de pago
            Cell statusCell = new Cell();
            String statusText = status ? "✅ Sí" : "❌ No";
            Color statusColor = status ? new Color(34, 197, 94) : new Color(239, 68, 68);
            statusCell.add(new Paragraph(statusText)
                    .setFont(normalFont)
                    .setFontSize(9)
                    .setFontColor(new DeviceRgb(statusColor.getRed(), statusColor.getGreen(), statusColor.getBlue())));
            expenseTable.addCell(statusCell);
        }

        document.add(expenseTable);
        document.add(new Paragraph("\n"));
    }

    private void addUserSummary(Document document, JsonNode data, PdfFont headerFont, PdfFont normalFont) {
        Paragraph summaryTitle = new Paragraph("👥 RESUMEN POR USUARIO")
                .setFont(headerFont)
                .setFontSize(14)
                .setFontColor(new DeviceRgb(31, 41, 55))
                .setMarginBottom(15);
        document.add(summaryTitle);

        JsonNode lineData = data.get("lineData");

        // Crear tabla de resumen por usuario
        Table userTable = new Table(3);
        userTable.setWidth(UnitValue.createPercentValue(100));

        // Headers
        userTable.addHeaderCell(createHeaderCell("Usuario", headerFont));
        userTable.addHeaderCell(createHeaderCell("Total Pagado", headerFont));
        userTable.addHeaderCell(createHeaderCell("Contribución", headerFont));

        double totalGeneral = data.get("totalExpenses").asDouble();

        for (JsonNode userLine : lineData) {
            String userName = userLine.get("name").asText();
            JsonNode dataPoints = userLine.get("dataPoints");

            double userTotal = 0;
            for (JsonNode point : dataPoints) {
                userTotal += point.get("y").asDouble();
            }

            double percentage = (userTotal / totalGeneral) * 100;

            userTable.addCell(createDataCell(userName, normalFont));
            userTable.addCell(createDataCell("$" + String.format("%,.0f", userTotal), normalFont));
            userTable.addCell(createDataCell(String.format("%.1f%%", percentage), normalFont));
        }

        document.add(userTable);
        document.add(new Paragraph("\n"));
    }

    private void addFooter(Document document, PdfFont normalFont) {
        // Separador
        document.add(new Paragraph("_".repeat(80))
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(new DeviceRgb(229, 231, 235))
                .setMarginTop(20));

        Paragraph footer = new Paragraph("Reporte generado automáticamente por el Sistema Gasta-2")
                .setFont(normalFont)
                .setFontSize(8)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(new DeviceRgb(107, 114, 128))
                .setMarginTop(10);
        document.add(footer);
    }

    private Cell createHeaderCell(String text, PdfFont font) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text)
                .setFont(font)
                .setFontSize(10)
                .setFontColor(new DeviceRgb(255, 255, 255))
                .setTextAlignment(TextAlignment.CENTER));
        cell.setBackgroundColor(new DeviceRgb(31, 41, 55));
        cell.setPadding(8);
        return cell;
    }

    private Cell createDataCell(String text, PdfFont font) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text).setFont(font).setFontSize(9));
        cell.setPadding(6);
        return cell;
    }

    private String generateTextBar(int percentage) {
        int barLength = percentage / 5; // Cada 5% = 1 carácter
        return "█".repeat(Math.max(1, barLength)) + "░".repeat(20 - barLength);
    }
}