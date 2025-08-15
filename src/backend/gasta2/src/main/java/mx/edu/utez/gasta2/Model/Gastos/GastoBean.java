package mx.edu.utez.gasta2.Model.Gastos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaBean;
import mx.edu.utez.gasta2.Model.Pagos.PagoBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "Gastos")
public class GastoBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column()
    private int cantidad;

    @Column(columnDefinition = "DATE")
    private LocalDate fecha;

//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "fk_id_usuario")
//    private UsuarioBean usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk_id_categoria" )
    private CategoriaBean tipogasto;

    @JsonIgnore
    @OneToMany(mappedBy = "gasto", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<PagoBean> pagoBeans;
    public GastoBean() {
    }

//    public GastoBean(Long id, String descripcion, int cantidad, LocalDate fecha, UsuarioBean usuario, CategoriaBean tipogasto) {
//        this.id = id;
//        this.descripcion = descripcion;
//        this.cantidad = cantidad;
//        this.fecha = fecha;
//        this.usuario = usuario;
//        this.tipogasto = tipogasto;
//    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

//    public UsuarioBean getUsuario() {
//        return usuario;
//    }
//
//    public void setUsuario(UsuarioBean usuario) {
//        this.usuario = usuario;
//    }

    public CategoriaBean getTipogasto() {
        return tipogasto;
    }

    public void setTipogasto(CategoriaBean tipogasto) {
        this.tipogasto = tipogasto;
    }

    public Set<PagoBean> getPagoBeans() {
        return pagoBeans;
    }

    public void setPagoBeans(Set<PagoBean> pagoBeans) {
        this.pagoBeans = pagoBeans;
    }
}
