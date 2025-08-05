package mx.edu.utez.gasta2.Model.Reporte.DTO;

import java.util.List;

public class ReporteDTO {
    private List<CategoriasDTO> categorias;
    private List<UsuarioAporteDTO> aportesPorUsuario;
    private EstadisticasGeneralesDTO estadisticas;
    private String nombreEspacio;
    private String periodo;

    // Constructores
    public ReporteDTO() {}

    public ReporteDTO(List<CategoriasDTO> categorias, List<UsuarioAporteDTO> aportesPorUsuario,
                      EstadisticasGeneralesDTO estadisticas, String nombreEspacio, String periodo) {
        this.categorias = categorias;
        this.aportesPorUsuario = aportesPorUsuario;
        this.estadisticas = estadisticas;
        this.nombreEspacio = nombreEspacio;
        this.periodo = periodo;
    }

    // Getters y Setters
    public List<CategoriasDTO> getCategorias() { return categorias; }
    public void setCategorias(List<CategoriasDTO> categorias) { this.categorias = categorias; }

    public List<UsuarioAporteDTO> getAportesPorUsuario() { return aportesPorUsuario; }
    public void setAportesPorUsuario(List<UsuarioAporteDTO> aportesPorUsuario) { this.aportesPorUsuario = aportesPorUsuario; }

    public EstadisticasGeneralesDTO getEstadisticas() { return estadisticas; }
    public void setEstadisticas(EstadisticasGeneralesDTO estadisticas) { this.estadisticas = estadisticas; }

    public String getNombreEspacio() { return nombreEspacio; }
    public void setNombreEspacio(String nombreEspacio) { this.nombreEspacio = nombreEspacio; }

    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
}