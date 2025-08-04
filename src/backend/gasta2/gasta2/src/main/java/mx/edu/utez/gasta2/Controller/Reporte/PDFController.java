package mx.edu.utez.gasta2.Controller.Reporte;

import mx.edu.utez.gasta2.Service.Reportes.PDF.PDFReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class PDFController {

    @Autowired
    private PDFReportService pdfReportService;

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> generatePDFReport(@RequestBody String reportData) {
        try {
            byte[] pdfBytes = pdfReportService.generatePDFReport(reportData);

            // Crear nombre de archivo con timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "reporte_gastos_" + timestamp + ".pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/pdf/preview")
    public ResponseEntity<byte[]> previewPDFReport(@RequestBody String reportData) {
        try {
            byte[] pdfBytes = pdfReportService.generatePDFReport(reportData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "preview_reporte.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}