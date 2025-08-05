package mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UnirseEspacioDTO {
    @NotNull(groups = {Join.class})
    private Long idUsuario;
    @NotBlank(groups = {Join.class})
    private String codigoEspacio;

    public UnirseEspacioDTO() {}

    public UnirseEspacioDTO(Long idUsuario, String codigoEspacio) {
        this.idUsuario = idUsuario;
        this.codigoEspacio = codigoEspacio;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getCodigoEspacio() {
        return codigoEspacio;
    }

    public void setCodigoEspacio(String codigoEspacio) {
        this.codigoEspacio = codigoEspacio;
    }

    public interface Join{}
}