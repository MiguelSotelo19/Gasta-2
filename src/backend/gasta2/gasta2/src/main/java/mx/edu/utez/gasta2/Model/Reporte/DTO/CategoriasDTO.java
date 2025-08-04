package mx.edu.utez.gasta2.Model.Reporte.DTO;

public class CategoriasDTO {
    private String nombre;
    private Double monto;
    private Double porcentaje;
    private String color;

    public CategoriasDTO() {}

    public CategoriasDTO(String nombre, Double monto, Double porcentaje, String color) {
        this.nombre = nombre;
        this.monto = monto;
        this.porcentaje = porcentaje;
        this.color = color;
    }

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }

    public Double getPorcentaje() { return porcentaje; }
    public void setPorcentaje(Double porcentaje) { this.porcentaje = porcentaje; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}