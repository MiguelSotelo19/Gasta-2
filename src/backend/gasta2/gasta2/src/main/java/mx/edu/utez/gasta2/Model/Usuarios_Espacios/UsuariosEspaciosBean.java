package mx.edu.utez.gasta2.Model.Usuarios_Espacios;

import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Roles.RolBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;

@Entity
@Table(name = "Usuarios_Espacios")
public class UsuariosEspaciosBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_usuario", nullable = false)
    private UsuarioBean usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_espacio", nullable = true)
    private EspacioBean espacio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol", nullable = false)
    private RolBean rol;

    @Column(name = "porcentaje_gasto")
    private Double porcentajeGasto;


    public UsuariosEspaciosBean() {
    }

    public UsuariosEspaciosBean(UsuarioBean usuario, EspacioBean espacio, RolBean rol, Double porcentajeGasto) {
        this.usuario = usuario;
        this.espacio = espacio;
        this.rol = rol;
        this.porcentajeGasto = porcentajeGasto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UsuarioBean getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioBean usuario) {
        this.usuario = usuario;
    }

    public EspacioBean getEspacio() {
        return espacio;
    }

    public void setEspacio(EspacioBean espacio) {
        this.espacio = espacio;
    }

    public RolBean getRol() {
        return rol;
    }



    public void setRol(RolBean rol) {
        this.rol = rol;
    }

    public Double getPorcentajeGasto() {
        return porcentajeGasto;
    }

    public void setPorcentajeGasto(Double porcentajeGasto) {
        this.porcentajeGasto = porcentajeGasto;
    }
}
