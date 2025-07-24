package mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class AsignarPorcentajeDTO {

    @NotNull()
    @DecimalMin(value = "0.01", message = "El porcentaje debe ser mayor que 0")
    @DecimalMax(value = "100.00", message = "El porcentaje no puede ser mayor que 100")
    private Double porcentaje;

    public Double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(Double porcentaje) {
        this.porcentaje = porcentaje;
    }
}