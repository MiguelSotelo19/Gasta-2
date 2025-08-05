package mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO;

public class PorcentajeAsignacionDTO {
    private Long idUsuario;
    private double porcentaje;

    public PorcentajeAsignacionDTO() {
    }

    public PorcentajeAsignacionDTO(Long idUsuario, double porcentaje) {
        this.idUsuario = idUsuario;
        this.porcentaje = porcentaje;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(double porcentaje) {
        this.porcentaje = porcentaje;
    }
}
