package mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO;

import jakarta.validation.constraints.NotNull;

public class ChangeRolDTO {

    @NotNull(groups = {changeRole.class})
    Long idSpace;
    @NotNull(groups = {changeRole.class})
    Long idAdmin;
    @NotNull(groups = {changeRole.class})
    Long idUser;

    public interface changeRole{}

    public ChangeRolDTO() {
    }

    public Long getIdSpace() {
        return idSpace;
    }

    public void setIdSpace(Long idSpace) {
        this.idSpace = idSpace;
    }

    public Long getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }
}
