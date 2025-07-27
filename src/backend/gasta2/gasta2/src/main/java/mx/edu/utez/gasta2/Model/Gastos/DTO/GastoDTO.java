package mx.edu.utez.gasta2.Model.Gastos.DTO;

import java.time.LocalDate;

public class GastoDTO {
    private int cantidad;
    private String descripcion;
    private LocalDate fecha;
    private Long idUsuario;
    private Long idCategoria;
    private Long idEspacio;

    public GastoDTO() {
    }

    public GastoDTO(int cantidad, String descripcion, LocalDate fecha, Long idUsuario, Long idCategoria, Long idEspacio) {
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.idUsuario = idUsuario;
        this.idCategoria = idCategoria;
        this.idEspacio = idEspacio;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
    }

    public Long getIdEspacio() {
        return idEspacio;
    }

    public void setIdEspacio(Long idEspacio) {
        this.idEspacio = idEspacio;
    }
}
