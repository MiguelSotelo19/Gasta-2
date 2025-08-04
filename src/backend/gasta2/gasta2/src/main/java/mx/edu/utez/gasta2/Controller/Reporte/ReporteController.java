package mx.edu.utez.gasta2.Controller.Reporte;

import mx.edu.utez.gasta2.Model.Reporte.DTO.ReporteDTO;
import mx.edu.utez.gasta2.Service.Reportes.ExcelReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ExcelReportService excelReportService;

    @PostMapping("/excel")
    public ResponseEntity<byte[]> generarReporteExcel(@RequestBody ReporteDTO reporteDTO) {
        try {
            // Generar el archivo Excel
            byte[] excelBytes = excelReportService.generarReporteExcel(reporteDTO);

            // Crear nombre del archivo con timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = String.format("Reporte_%s_%s.xlsx",
                    reporteDTO.getNombreEspacio().replaceAll("[^a-zA-Z0-9]", "_"),
                    timestamp);

            // Configurar headers de respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            headers.setPragma("public");
            headers.setContentLength(excelBytes.length);

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<String> previewReporte(@RequestBody ReporteDTO reporteDTO) {
        try {
            // Generar un resumen en texto para preview
            StringBuilder preview = new StringBuilder();
            preview.append("=== PREVIEW DEL REPORTE ===\n");
            preview.append("Espacio: ").append(reporteDTO.getNombreEspacio()).append("\n");
            preview.append("Período: ").append(reporteDTO.getPeriodo()).append("\n\n");

            if (reporteDTO.getEstadisticas() != null) {
                preview.append("ESTADÍSTICAS GENERALES:\n");
                preview.append("- Total Gastos: $").append(String.format("%.2f", reporteDTO.getEstadisticas().getTotalGastos())).append("\n");
                preview.append("- Promedio por Gasto: $").append(String.format("%.2f", reporteDTO.getEstadisticas().getPromedioGasto())).append("\n");
                preview.append("- Total Registros: ").append(reporteDTO.getEstadisticas().getTotalRegistros()).append("\n");
                preview.append("- Categorías Activas: ").append(reporteDTO.getEstadisticas().getCategoriasActivas()).append("\n\n");
            }

            preview.append("CATEGORÍAS (").append(reporteDTO.getCategorias().size()).append("):\n");
            reporteDTO.getCategorias().forEach(cat ->
                    preview.append("- ").append(cat.getNombre()).append(": $").append(String.format("%.2f", cat.getMonto())).append("\n")
            );

            preview.append("\nUSUARIOS (").append(reporteDTO.getAportesPorUsuario().size()).append("):\n");
            reporteDTO.getAportesPorUsuario().forEach(user ->
                    preview.append("- ").append(user.getUsuario()).append(": $").append(String.format("%.2f", user.getTotalAportado())).append("\n")
            );

            return ResponseEntity.ok(preview.toString());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al generar preview: " + e.getMessage());
        }
    }
}