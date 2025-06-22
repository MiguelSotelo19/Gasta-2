package mx.edu.utez.gasta2.Model.Usuarios.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;

import java.util.Set;

public class UsuarioDTO {

    private Long id;
    private String nombreusuario;
    private String correo;
    private String contrasenia;
    private Integer espaciosdisponibles;
    private Set<GastoBean> gastoBeans;

    private Boolean status;


    public UsuarioBean toEntity(){
        return new UsuarioBean(nombreusuario,correo,contrasenia,espaciosdisponibles,status);
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreusuario() {
        return nombreusuario;
    }

    public void setNombreusuario(String nombreusuario) {
        this.nombreusuario = nombreusuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public Integer getEspaciosdisponibles() {
        return espaciosdisponibles;
    }

    public void setEspaciosdisponibles(Integer espaciosdisponibles) {
        this.espaciosdisponibles = espaciosdisponibles;
    }

    public Set<GastoBean> getGastoBeans() {
        return gastoBeans;
    }

    public void setGastoBeans(Set<GastoBean> gastoBeans) {
        this.gastoBeans = gastoBeans;
    }
}
