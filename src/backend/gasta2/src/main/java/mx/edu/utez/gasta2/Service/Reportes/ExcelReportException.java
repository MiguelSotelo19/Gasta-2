package mx.edu.utez.gasta2.Service.Reportes;

public class ExcelReportException extends RuntimeException {
    public ExcelReportException(String message) {
        super(message);
    }

    public ExcelReportException(String message, Throwable cause) {
        super(message, cause);
    }
}