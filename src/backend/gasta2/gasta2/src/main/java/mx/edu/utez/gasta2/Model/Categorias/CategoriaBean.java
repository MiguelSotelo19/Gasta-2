package mx.edu.utez.gasta2.Model.Categorias;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;

import java.util.Set;

@Entity
@Table(name = "Categorias")
public class CategoriaBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public CategoriaBean() {
    }

    public CategoriaBean(Long id, String nombre, Set<GastoBean> gastoBeans) {
        this.id = id;
        this.nombre = nombre;
        this.gastoBeans = gastoBeans;
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

    public Set<GastoBean> getGastoBeans() {
        return gastoBeans;
    }

    public void setGastoBeans(Set<GastoBean> gastoBeans) {
        this.gastoBeans = gastoBeans;
    }

    @Column(length = 50)
    private String nombre;

    @JsonIgnore
    @OneToMany(mappedBy = "tipogasto", fetch = FetchType.LAZY)
    private Set<GastoBean> gastoBeans;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk_id_espacio")
    private EspacioBean espacio;
}
