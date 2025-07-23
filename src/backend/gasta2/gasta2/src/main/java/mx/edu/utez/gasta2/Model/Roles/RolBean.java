package mx.edu.utez.gasta2.Model.Roles;

import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;

import java.util.Set;
import java.util.function.LongFunction;

@Entity
@Table(name = "Roles")
public class RolBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String rol;

    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UsuariosEspaciosBean> usuariosEspacios;

    public RolBean(Long id, String rol) {
        this.id = id;
        this.rol = rol;
    }

    public RolBean(String rol) {
        this.rol = rol;
    }

    public Long getId() {
        return id;
    }

    public RolBean() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
