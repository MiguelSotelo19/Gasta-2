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
    private int codigoinvitacion;

    @JsonIgnore
    @OneToMany(mappedBy = "espacio", fetch = FetchType.LAZY)
    private Set<CategoriaBean> categoriaBeans;
}
