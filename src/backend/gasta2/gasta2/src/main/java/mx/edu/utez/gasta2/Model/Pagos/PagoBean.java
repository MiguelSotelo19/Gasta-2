package mx.edu.utez.gasta2.Model.Pagos;

import jakarta.persistence.*;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;
import mx.edu.utez.gasta2.Model.Roles.RolBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;

@Entity
@Table(name = "pagos")
public class PagoBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "DOUBLE")
    private double monto;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean estatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_gasto", nullable = true)
    private GastoBean gasto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_id_usuario", nullable = false)
    private UsuarioBean usuario;

    public PagoBean() {
    }

    public PagoBean(Long id, double monto, Boolean estatus, GastoBean gasto, UsuarioBean usuario) {
        this.id = id;
        this.monto = monto;
        this.estatus = estatus;
        this.gasto = gasto;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public GastoBean getGasto() {
        return gasto;
    }

    public void setGasto(GastoBean gasto) {
        this.gasto = gasto;
    }

    public UsuarioBean getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioBean usuario) {
        this.usuario = usuario;
    }
}
