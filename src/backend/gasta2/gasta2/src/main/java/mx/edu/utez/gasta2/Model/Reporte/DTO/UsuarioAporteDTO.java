package mx.edu.utez.gasta2.Model.Reporte.DTO;

import java.util.List;

public class UsuarioAporteDTO {
    private String usuario;
    private List<AporteDTO> aportes;
    private Double totalAportado;

    public UsuarioAporteDTO() {}

    public UsuarioAporteDTO(String usuario, List<AporteDTO> aportes, Double totalAportado) {
        this.usuario = usuario;
        this.aportes = aportes;
        this.totalAportado = totalAportado;
    }

    // Getters y Setters
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public List<AporteDTO> getAportes() { return aportes; }
    public void setAportes(List<AporteDTO> aportes) { this.aportes = aportes; }

    public Double getTotalAportado() { return totalAportado; }
    public void setTotalAportado(Double totalAportado) { this.totalAportado = totalAportado; }
}