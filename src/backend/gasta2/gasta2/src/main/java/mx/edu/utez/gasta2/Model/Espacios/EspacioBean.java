package mx.edu.utez.gasta2.Model.Espacios;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaBean;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;

import java.util.Set;

@Entity
@Table(name = "Espacios")
public class EspacioBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String nombre;

    @Column(length = 5)
    private String codigoinvitacion;

    @JsonIgnore
    @OneToMany(mappedBy = "espacio", fetch = FetchType.LAZY)
    private Set<CategoriaBean> categoriaBeans;

    public EspacioBean(String nombre, String codigoinvitacion, Set<CategoriaBean> categoriaBeans) {
        this.nombre = nombre;
        this.codigoinvitacion = codigoinvitacion;
        this.categoriaBeans = categoriaBeans;
    }

    public EspacioBean(Long id, String nombre, String codigoinvitacion, Set<CategoriaBean> categoriaBeans) {
        this.id = id;
        this.nombre = nombre;
        this.codigoinvitacion = codigoinvitacion;
        this.categoriaBeans = categoriaBeans;
    }

    public EspacioBean(String nombre, String codigoinvitacion) {
        this.nombre = nombre;
        this.codigoinvitacion = codigoinvitacion;
    }

    public EspacioBean(String nombre) {
        this.nombre = nombre;
    }

    public EspacioBean() {
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

    public Set<CategoriaBean> getCategoriaBeans() {
        return categoriaBeans;
    }

    public void setCategoriaBeans(Set<CategoriaBean> categoriaBeans) {
        this.categoriaBeans = categoriaBeans;
    }
}
