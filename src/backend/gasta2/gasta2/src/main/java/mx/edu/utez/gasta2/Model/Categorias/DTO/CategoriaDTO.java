package mx.edu.utez.gasta2.Model.Categorias.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaBean;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;

public class CategoriaDTO {
    @NotBlank(groups = {Register.class, Update.class})
    private String nombre;
    @NotNull(groups = {Register.class, Update.class})
    private EspacioBean espacioBean;

    public interface Register{}
    public interface Update{}

    public CategoriaBean toEntity(){
        return new CategoriaBean(nombre,espacioBean);
    }
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public EspacioBean getEspacioBean() {
        return espacioBean;
    }

    public void setEspacioBean(EspacioBean espacioBean) {
        this.espacioBean = espacioBean;
    }

    public CategoriaDTO(String nombre, EspacioBean espacioBean) {
        this.nombre = nombre;
        this.espacioBean = espacioBean;
    }
}
