package mx.edu.utez.gasta2.Model.Usuarios;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;
import java.util.Set;

@Entity
@Table(name = "Usuarios")
public class UsuarioBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true)
    private String nombreusuario;

    @Column(length = 50, unique = true)
    private String correo;

    @Column(columnDefinition = "TEXT")
    private String contrasenia;

    @Column()
    private Integer espaciosdisponibles;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private Set<GastoBean> gastoBeans;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean status;

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public UsuarioBean(Long id, String nombreusuario, String correo, String contrasenia, Integer espaciosdisponibles, Boolean status) {
        this.id = id;
        this.nombreusuario = nombreusuario;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.espaciosdisponibles = espaciosdisponibles;
        this.status = status;
    }

    public UsuarioBean(String nombreusuario, String correo, String contrasenia, Integer espaciosdisponibles, Boolean status) {
        this.nombreusuario = nombreusuario;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.espaciosdisponibles = espaciosdisponibles;
        this.status = status;
    }

    public UsuarioBean(Long id, String nombreusuario, String correo, String contrasenia, Integer espaciosdisponibles) {
        this.id = id;
        this.nombreusuario = nombreusuario ;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.espaciosdisponibles = espaciosdisponibles;
    }

    public UsuarioBean(String nombreusuario, String correo, String contrasenia, Integer espaciosdisponibles) {
        this.nombreusuario = nombreusuario;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.espaciosdisponibles = espaciosdisponibles;
    }

    public UsuarioBean() {
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
}
