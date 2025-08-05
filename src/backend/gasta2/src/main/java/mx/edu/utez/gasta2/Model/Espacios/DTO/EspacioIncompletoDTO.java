package mx.edu.utez.gasta2.Model.Espacios.DTO;

import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;

public class EspacioIncompletoDTO {
    private Long id;
    private String nombre;
    private String codigoinvitacion;
    private boolean status;
    private double porcentajeFaltante;

    // Constructor
    public EspacioIncompletoDTO(EspacioBean espacio, double porcentajeFaltante) {
        this.id = espacio.getId();
        this.nombre = espacio.getNombre();
        this.codigoinvitacion = espacio.getCodigoinvitacion();
        this.status = espacio.getStatus();
        this.porcentajeFaltante = porcentajeFaltante;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigoinvitacion() {
        return codigoinvitacion;
    }

    public void setCodigoinvitacion(String codigoinvitacion) {
        this.codigoinvitacion = codigoinvitacion;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public double getPorcentajeFaltante() {
        return porcentajeFaltante;
    }

    public void setPorcentajeFaltante(double porcentajeFaltante) {
        this.porcentajeFaltante = porcentajeFaltante;
    }
}