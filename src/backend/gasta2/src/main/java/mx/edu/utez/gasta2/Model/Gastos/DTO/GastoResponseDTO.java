package mx.edu.utez.gasta2.Model.Gastos.DTO;

import java.time.LocalDate;

public class GastoResponseDTO {
    private Long idGasto;
    private String descripcion;
    private Double cantidad;
    private LocalDate fecha;
    private Long idTipoGasto;
    private String nombreTipoGasto;
    private Long idUsuario;
    private String nombreUsuario;
    private Double montoPago; // Ejemplo: info de pago que quieres mostrar
    private Boolean estatusPago;

    public GastoResponseDTO(Long idGasto, String descripcion, Double cantidad, LocalDate fecha,
                            Long idTipoGasto, String nombreTipoGasto,
                            Long idUsuario, String nombreUsuario,
                            Double montoPago, Boolean estatusPago) {
        this.idGasto = idGasto;
        this.descripcion = descripcion;
        this.cantidad =  cantidad;
        this.fecha = fecha;
        this.idTipoGasto = idTipoGasto;
        this.nombreTipoGasto = nombreTipoGasto;
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.montoPago = montoPago;
        this.estatusPago = estatusPago;
    }

    public Long getIdGasto() {
        return idGasto;
    }

    public void setIdGasto(Long idGasto) {
        this.idGasto = idGasto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getIdTipoGasto() {
        return idTipoGasto;
    }

    public void setIdTipoGasto(Long idTipoGasto) {
        this.idTipoGasto = idTipoGasto;
    }

    public String getNombreTipoGasto() {
        return nombreTipoGasto;
    }

    public void setNombreTipoGasto(String nombreTipoGasto) {
        this.nombreTipoGasto = nombreTipoGasto;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public Double getMontoPago() {
        return montoPago;
    }

    public void setMontoPago(Double montoPago) {
        this.montoPago = montoPago;
    }

    public Boolean getEstatusPago() {
        return estatusPago;
    }

    public void setEstatusPago(Boolean estatusPago) {
        this.estatusPago = estatusPago;
    }
}
