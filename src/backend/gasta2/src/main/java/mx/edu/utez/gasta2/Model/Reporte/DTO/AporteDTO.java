package mx.edu.utez.gasta2.Model.Reporte.DTO;

import java.time.LocalDate;

public class AporteDTO {
    private LocalDate fecha;
    private Double monto;

    public AporteDTO() {}

    public AporteDTO(LocalDate fecha, Double monto) {
        this.fecha = fecha;
        this.monto = monto;
    }

    // Getters y Setters
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
}