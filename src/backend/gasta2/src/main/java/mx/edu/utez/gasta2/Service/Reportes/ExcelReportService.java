package mx.edu.utez.gasta2.Service.Reportes;

import mx.edu.utez.gasta2.Model.Reporte.DTO.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelReportService {

    public byte[] generarReporteExcel(ReporteDTO reporte) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            // Crear hojas
            crearHojaResumenEjecutivo(workbook, reporte);
            crearHojaCategorias(workbook, reporte);
            crearHojaAportesPorUsuario(workbook, reporte);
            crearHojaDetalleCompleto(workbook, reporte);

            // Convertir a bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private void crearHojaResumenEjecutivo(XSSFWorkbook workbook, ReporteDTO reporte) {
        XSSFSheet sheet = workbook.createSheet("Resumen Ejecutivo");

        // Crear estilos
        CellStyle titleStyle = crearEstiloTitulo(workbook);
        CellStyle headerStyle = crearEstiloHeader(workbook);
        CellStyle dataStyle = crearEstiloDatos(workbook);
        CellStyle moneyStyle = crearEstiloMoneda(workbook);

        int rowNum = 0;

        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("REPORTE FINANCIERO - " + reporte.getNombreEspacio());
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

        rowNum++; // Línea en blanco

        // Período
        Row periodRow = sheet.createRow(rowNum++);
        Cell periodLabelCell = periodRow.createCell(0);
        periodLabelCell.setCellValue("Período:");
        periodLabelCell.setCellStyle(headerStyle);
        Cell periodValueCell = periodRow.createCell(1);
        periodValueCell.setCellValue(reporte.getPeriodo());
        periodValueCell.setCellStyle(dataStyle);

        rowNum++; // Línea en blanco

        // Estadísticas generales
        Row statsHeaderRow = sheet.createRow(rowNum++);
        Cell statsHeaderCell = statsHeaderRow.createCell(0);
        statsHeaderCell.setCellValue("ESTADÍSTICAS GENERALES");
        statsHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum-1, rowNum-1, 0, 3));

        EstadisticasGeneralesDTO stats = reporte.getEstadisticas();

        // Total de gastos
        Row totalRow = sheet.createRow(rowNum++);
        totalRow.createCell(0).setCellValue("Total de Gastos:");
        totalRow.getCell(0).setCellStyle(dataStyle);
        Cell totalCell = totalRow.createCell(1);
        totalCell.setCellValue(stats.getTotalGastos());
        totalCell.setCellStyle(moneyStyle);

        // Promedio por gasto
        Row avgRow = sheet.createRow(rowNum++);
        avgRow.createCell(0).setCellValue("Promedio por Gasto:");
        avgRow.getCell(0).setCellStyle(dataStyle);
        Cell avgCell = avgRow.createCell(1);
        avgCell.setCellValue(stats.getPromedioGasto());
        avgCell.setCellStyle(moneyStyle);

        // Total registros
        Row recordsRow = sheet.createRow(rowNum++);
        recordsRow.createCell(0).setCellValue("Total de Registros:");
        recordsRow.getCell(0).setCellStyle(dataStyle);
        recordsRow.createCell(1).setCellValue(stats.getTotalRegistros());
        recordsRow.getCell(1).setCellStyle(dataStyle);

        // Categorías activas
        Row categoriesRow = sheet.createRow(rowNum++);
        categoriesRow.createCell(0).setCellValue("Categorías Activas:");
        categoriesRow.getCell(0).setCellStyle(dataStyle);
        categoriesRow.createCell(1).setCellValue(stats.getCategoriasActivas());
        categoriesRow.getCell(1).setCellStyle(dataStyle);

        rowNum += 2; // Líneas en blanco

        // Top 3 categorías
        Row topCatHeaderRow = sheet.createRow(rowNum++);
        Cell topCatHeaderCell = topCatHeaderRow.createCell(0);
        topCatHeaderCell.setCellValue("TOP 3 CATEGORÍAS CON MAYOR GASTO");
        topCatHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum-1, rowNum-1, 0, 3));

        List<CategoriasDTO> topCategorias = reporte.getCategorias().stream()
                .sorted((a, b) -> Double.compare(b.getMonto(), a.getMonto()))
                .limit(3)
                .toList();

        for (int i = 0; i < topCategorias.size(); i++) {
            CategoriasDTO cat = topCategorias.get(i);
            Row catRow = sheet.createRow(rowNum++);
            catRow.createCell(0).setCellValue((i + 1) + ". " + cat.getNombre());
            catRow.getCell(0).setCellStyle(dataStyle);
            Cell catAmountCell = catRow.createCell(1);
            catAmountCell.setCellValue(cat.getMonto());
            catAmountCell.setCellStyle(moneyStyle);
            catRow.createCell(2).setCellValue(String.format("%.1f%%", cat.getPorcentaje()));
            catRow.getCell(2).setCellStyle(dataStyle);
        }

        // Ajustar ancho de columnas
        for (int i = 0; i <= 5; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 800);
        }
    }

    private void crearHojaCategorias(XSSFWorkbook workbook, ReporteDTO reporte) {
        XSSFSheet sheet = workbook.createSheet("Gastos por Categoría");

        CellStyle headerStyle = crearEstiloHeader(workbook);
        CellStyle dataStyle = crearEstiloDatos(workbook);
        CellStyle moneyStyle = crearEstiloMoneda(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("DISTRIBUCIÓN DE GASTOS POR CATEGORÍA");
        titleCell.setCellStyle(crearEstiloTitulo(workbook));
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

        rowNum++; // Línea en blanco

        // Headers de la tabla
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Categoría", "Monto", "Porcentaje", "Participación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Datos de categorías
        int dataStartRow = rowNum;
        for (CategoriasDTO categoria : reporte.getCategorias()) {
            Row dataRow = sheet.createRow(rowNum++);
            dataRow.createCell(0).setCellValue(categoria.getNombre());
            dataRow.getCell(0).setCellStyle(dataStyle);

            Cell montoCell = dataRow.createCell(1);
            montoCell.setCellValue(categoria.getMonto());
            montoCell.setCellStyle(moneyStyle);

            dataRow.createCell(2).setCellValue(categoria.getPorcentaje());
            dataRow.getCell(2).setCellStyle(dataStyle);

            dataRow.createCell(3).setCellValue(String.format("%.1f%%", categoria.getPorcentaje()));
            dataRow.getCell(3).setCellStyle(dataStyle);
        }

        // Crear gráfico de pastel
        XSSFDrawing drawing = sheet.createDrawingPatriarch();
        XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 6, 3, 14, 20);
        XSSFChart chart = drawing.createChart(anchor);
        chart.setTitleText("Distribución por Categorías");
        chart.setTitleOverlay(false);

        XDDFChartLegend legend = chart.getOrAddLegend();
        legend.setPosition(LegendPosition.RIGHT);

        XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(sheet,
                new CellRangeAddress(dataStartRow, rowNum - 1, 0, 0));
        XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(sheet,
                new CellRangeAddress(dataStartRow, rowNum - 1, 1, 1));

        XDDFPieChartData pieChartData = (XDDFPieChartData) chart.createData(ChartTypes.PIE, null, null);
        XDDFPieChartData.Series series = (XDDFPieChartData.Series) pieChartData.addSeries(categories, values);
        series.setTitle("Gastos por Categoría", null);

        chart.plot(pieChartData);

        // Ajustar columnas
        for (int i = 0; i <= 3; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 800);
        }
    }

    private void crearHojaAportesPorUsuario(XSSFWorkbook workbook, ReporteDTO reporte) {
        XSSFSheet sheet = workbook.createSheet("Aportes por Usuario");

        CellStyle headerStyle = crearEstiloHeader(workbook);
        CellStyle dataStyle = crearEstiloDatos(workbook);
        CellStyle moneyStyle = crearEstiloMoneda(workbook);
        CellStyle dateStyle = crearEstiloFecha(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("APORTES POR USUARIO");
        titleCell.setCellStyle(crearEstiloTitulo(workbook));
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));

        rowNum++; // Línea en blanco

        // Headers
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Usuario", "Fecha", "Monto", "Acumulado", "% Participación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Calcular total general para porcentajes
        double totalGeneral = reporte.getAportesPorUsuario().stream()
                .mapToDouble(UsuarioAporteDTO::getTotalAportado)
                .sum();

        int dataStartRow = rowNum;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (UsuarioAporteDTO usuarioAporte : reporte.getAportesPorUsuario()) {
            double acumulado = 0;
            for (AporteDTO aporte : usuarioAporte.getAportes()) {
                Row dataRow = sheet.createRow(rowNum++);

                dataRow.createCell(0).setCellValue(usuarioAporte.getUsuario());
                dataRow.getCell(0).setCellStyle(dataStyle);

                dataRow.createCell(1).setCellValue(aporte.getFecha().format(formatter));
                dataRow.getCell(1).setCellStyle(dateStyle);

                Cell montoCell = dataRow.createCell(2);
                montoCell.setCellValue(aporte.getMonto());
                montoCell.setCellStyle(moneyStyle);

                acumulado += aporte.getMonto();
                Cell acumCell = dataRow.createCell(3);
                acumCell.setCellValue(acumulado);
                acumCell.setCellStyle(moneyStyle);

                double porcentaje = (usuarioAporte.getTotalAportado() / totalGeneral) * 100;
                dataRow.createCell(4).setCellValue(String.format("%.1f%%", porcentaje));
                dataRow.getCell(4).setCellStyle(dataStyle);
            }
        }

        // Crear gráfico de líneas
        XSSFDrawing drawing = sheet.createDrawingPatriarch();
        XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 7, 3, 15, 20);
        XSSFChart chart = drawing.createChart(anchor);
        chart.setTitleText("Evolución de Aportes por Usuario");
        chart.setTitleOverlay(false);

        XDDFCategoryAxis bottomAxis = chart.createCategoryAxis(AxisPosition.BOTTOM);
        bottomAxis.setTitle("Fecha");
        XDDFValueAxis leftAxis = chart.createValueAxis(AxisPosition.LEFT);
        leftAxis.setTitle("Monto Acumulado");

        XDDFLineChartData lineChartData = (XDDFLineChartData) chart.createData(ChartTypes.LINE, bottomAxis, leftAxis);

        // Agrupar datos por usuario para el gráfico
        for (UsuarioAporteDTO usuarioAporte : reporte.getAportesPorUsuario()) {
            // Crear serie para cada usuario (esto es una simplificación)
            XDDFDataSource<String> dates = XDDFDataSourcesFactory.fromStringCellRange(sheet,
                    new CellRangeAddress(dataStartRow, dataStartRow + usuarioAporte.getAportes().size() - 1, 1, 1));
            XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(sheet,
                    new CellRangeAddress(dataStartRow, dataStartRow + usuarioAporte.getAportes().size() - 1, 3, 3));

            XDDFLineChartData.Series series = (XDDFLineChartData.Series) lineChartData.addSeries(dates, values);
            series.setTitle(usuarioAporte.getUsuario(), null);
            series.setSmooth(false);
            series.setMarkerStyle(MarkerStyle.CIRCLE);

            dataStartRow += usuarioAporte.getAportes().size();
        }

        chart.plot(lineChartData);

        // Ajustar columnas
        for (int i = 0; i <= 4; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 800);
        }
    }

    private void crearHojaDetalleCompleto(XSSFWorkbook workbook, ReporteDTO reporte) {
        XSSFSheet sheet = workbook.createSheet("Detalle Completo");

        CellStyle headerStyle = crearEstiloHeader(workbook);
        CellStyle dataStyle = crearEstiloDatos(workbook);
        CellStyle moneyStyle = crearEstiloMoneda(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("RESUMEN DETALLADO POR USUARIO Y CATEGORÍA");
        titleCell.setCellStyle(crearEstiloTitulo(workbook));
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

        rowNum += 2; // Líneas en blanco

        // Sección: Totales por Usuario
        Row userHeaderRow = sheet.createRow(rowNum++);
        Cell userHeaderCell = userHeaderRow.createCell(0);
        userHeaderCell.setCellValue("TOTALES POR USUARIO");
        userHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum-1, rowNum-1, 0, 2));

        Row userTableHeaderRow = sheet.createRow(rowNum++);
        userTableHeaderRow.createCell(0).setCellValue("Usuario");
        userTableHeaderRow.getCell(0).setCellStyle(headerStyle);
        userTableHeaderRow.createCell(1).setCellValue("Total Aportado");
        userTableHeaderRow.getCell(1).setCellStyle(headerStyle);
        userTableHeaderRow.createCell(2).setCellValue("Número de Aportes");
        userTableHeaderRow.getCell(2).setCellStyle(headerStyle);

        for (UsuarioAporteDTO usuario : reporte.getAportesPorUsuario()) {
            Row userRow = sheet.createRow(rowNum++);
            userRow.createCell(0).setCellValue(usuario.getUsuario());
            userRow.getCell(0).setCellStyle(dataStyle);

            Cell totalCell = userRow.createCell(1);
            totalCell.setCellValue(usuario.getTotalAportado());
            totalCell.setCellStyle(moneyStyle);

            userRow.createCell(2).setCellValue(usuario.getAportes().size());
            userRow.getCell(2).setCellStyle(dataStyle);
        }

        rowNum += 2; // Líneas en blanco

        // Sección: Análisis por Categoría
        Row catAnalysisHeaderRow = sheet.createRow(rowNum++);
        Cell catAnalysisHeaderCell = catAnalysisHeaderRow.createCell(0);
        catAnalysisHeaderCell.setCellValue("ANÁLISIS POR CATEGORÍA");
        catAnalysisHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum-1, rowNum-1, 0, 3));

        Row catTableHeaderRow = sheet.createRow(rowNum++);
        catTableHeaderRow.createCell(0).setCellValue("Categoría");
        catTableHeaderRow.getCell(0).setCellStyle(headerStyle);
        catTableHeaderRow.createCell(1).setCellValue("Monto Total");
        catTableHeaderRow.getCell(1).setCellStyle(headerStyle);
        catTableHeaderRow.createCell(2).setCellValue("Porcentaje");
        catTableHeaderRow.getCell(2).setCellStyle(headerStyle);
        catTableHeaderRow.createCell(3).setCellValue("Ranking");
        catTableHeaderRow.getCell(3).setCellStyle(headerStyle);

        List<CategoriasDTO> categoriasOrdenadas = reporte.getCategorias().stream()
                .sorted((a, b) -> Double.compare(b.getMonto(), a.getMonto()))
                .toList();

        for (int i = 0; i < categoriasOrdenadas.size(); i++) {
            CategoriasDTO categoria = categoriasOrdenadas.get(i);
            Row catRow = sheet.createRow(rowNum++);

            catRow.createCell(0).setCellValue(categoria.getNombre());
            catRow.getCell(0).setCellStyle(dataStyle);

            Cell montoCell = catRow.createCell(1);
            montoCell.setCellValue(categoria.getMonto());
            montoCell.setCellStyle(moneyStyle);

            catRow.createCell(2).setCellValue(String.format("%.1f%%", categoria.getPorcentaje()));
            catRow.getCell(2).setCellStyle(dataStyle);

            catRow.createCell(3).setCellValue(i + 1);
            catRow.getCell(3).setCellStyle(dataStyle);
        }

        // Ajustar columnas
        for (int i = 0; i <= 5; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 800);
        }
    }

    // Métodos para crear estilos
    private CellStyle crearEstiloTitulo(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private CellStyle crearEstiloHeader(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle crearEstiloDatos(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle crearEstiloMoneda(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("$#,##0.00"));
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle crearEstiloFecha(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("dd/mm/yyyy"));
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
}