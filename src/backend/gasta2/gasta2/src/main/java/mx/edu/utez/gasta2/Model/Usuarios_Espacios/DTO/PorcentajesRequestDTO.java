package mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO;

import java.util.List;

public class PorcentajesRequestDTO {
    private Long idEspacio;
    private List<PorcentajeAsignacionDTO> asignaciones;

    public PorcentajesRequestDTO() {
    }

    public PorcentajesRequestDTO(Long idEspacio, List<PorcentajeAsignacionDTO> asignaciones) {
        this.idEspacio = idEspacio;
        this.asignaciones = asignaciones;
    }

    public Long getIdEspacio() {
        return idEspacio;
    }

    public void setIdEspacio(Long idEspacio) {
        this.idEspacio = idEspacio;
    }

    public List<PorcentajeAsignacionDTO> getAsignaciones() {
        return asignaciones;
    }

    public void setAsignaciones(List<PorcentajeAsignacionDTO> asignaciones) {
        this.asignaciones = asignaciones;
    }
}
