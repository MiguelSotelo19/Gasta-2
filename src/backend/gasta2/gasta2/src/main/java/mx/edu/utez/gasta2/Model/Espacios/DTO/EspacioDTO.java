package mx.edu.utez.gasta2.Model.Espacios.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaBean;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;

import java.util.Set;

public class EspacioDTO {
    @NotNull(groups = {Update.class})
    private Long id;
    @NotBlank(groups = {Register.class, Update.class})
    private String nombre;

    public EspacioBean toEntity(){
        return new EspacioBean(nombre);
    }
    public interface Register{}
    public interface Update {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
