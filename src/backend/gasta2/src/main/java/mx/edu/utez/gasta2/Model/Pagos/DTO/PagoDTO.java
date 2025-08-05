package mx.edu.utez.gasta2.Model.Pagos.DTO;

import mx.edu.utez.gasta2.Model.Pagos.PagoBean;

public class PagoDTO {
    private Long id;
    private double monto;
    private Boolean estatus;
    private Long idGasto;

    public PagoDTO(PagoBean pago) {
        this.id = pago.getId();
        this.monto = pago.getMonto();
        this.estatus = pago.getEstatus();
        this.idGasto = pago.getGasto() != null ? pago.getGasto().getId() : null;
    }

    public Long getId() {
        return id;
    }

    public double getMonto() {
        return monto;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public Long getIdGasto() {
        return idGasto;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public void setIdGasto(Long idGasto) {
        this.idGasto = idGasto;
    }
}