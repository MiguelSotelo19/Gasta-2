package mx.edu.utez.gasta2.Model.Reporte.DTO;

public class EstadisticasGeneralesDTO {
    private Double totalGastos;
    private Double promedioGasto;
    private Integer totalRegistros;
    private Integer categoriasActivas;

    public EstadisticasGeneralesDTO() {}

    public EstadisticasGeneralesDTO(Double totalGastos, Double promedioGasto,
                                    Integer totalRegistros, Integer categoriasActivas) {
        this.totalGastos = totalGastos;
        this.promedioGasto = promedioGasto;
        this.totalRegistros = totalRegistros;
        this.categoriasActivas = categoriasActivas;
    }

    // Getters y Setters
    public Double getTotalGastos() { return totalGastos; }
    public void setTotalGastos(Double totalGastos) { this.totalGastos = totalGastos; }

    public Double getPromedioGasto() { return promedioGasto; }
    public void setPromedioGasto(Double promedioGasto) { this.promedioGasto = promedioGasto; }

    public Integer getTotalRegistros() { return totalRegistros; }
    public void setTotalRegistros(Integer totalRegistros) { this.totalRegistros = totalRegistros; }

    public Integer getCategoriasActivas() { return categoriasActivas; }
    public void setCategoriasActivas(Integer categoriasActivas) { this.categoriasActivas = categoriasActivas; }
}