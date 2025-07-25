package mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO;

import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;

public class UsuariosEspaciosDTO {
    private Long id;
    private Long idEspacio;
    private String nombreUsuario;
    private String nombreEspacio;
    private String rol;
    private Double porcentajeGasto;

    public UsuariosEspaciosDTO(UsuariosEspaciosBean bean) {
        this.id = bean.getId();
        this.nombreUsuario = bean.getUsuario().getNombreusuario();
        this.idEspacio = bean.getEspacio() != null ? bean.getEspacio().getId() : null;
        this.nombreEspacio = bean.getEspacio() != null ? bean.getEspacio().getNombre() : null;
        this.rol = bean.getRol().getRol();
        this.porcentajeGasto = bean.getPorcentajeGasto();
    }

    public Long getIdEspacio() {
        return idEspacio;
    }

    public void setIdEspacio(Long idEspacio) {
        this.idEspacio = idEspacio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getNombreEspacio() {
        return nombreEspacio;
    }

    public void setNombreEspacio(String nombreEspacio) {
        this.nombreEspacio = nombreEspacio;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Double getPorcentajeGasto() {
        return porcentajeGasto;
    }

    public void setPorcentajeGasto(Double porcentajeGasto) {
        this.porcentajeGasto = porcentajeGasto;
    }
}
