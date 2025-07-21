package mx.edu.utez.gasta2.Service.Usuarios_Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UserEspaciosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.SQLException;

@Service
@Transactional
public class Usuarios_Espacio_Service {

    @Autowired
    private UserEspaciosRepository repository;

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> AsignarEspaciosUsuarios(UsuariosEspaciosBean bean) {
        if (bean.getUsuario() == null || bean.getUsuario().getId() == null) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El ID del usuario no debe ser vacío"), HttpStatus.BAD_REQUEST);
        }

        if (bean.getEspacio() == null || bean.getEspacio().getId() == null) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El ID del espacio no debe ser vacío"), HttpStatus.BAD_REQUEST);
        }

        if (bean.getRol() == null || bean.getRol().getId() == null) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El ID del rol no debe ser vacío"), HttpStatus.BAD_REQUEST);
        }

        if (bean.getPorcentajeGasto() == null || bean.getPorcentajeGasto() <= 0 || bean.getPorcentajeGasto() > 100) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El porcentaje de gasto no es válido"), HttpStatus.BAD_REQUEST);
        }

        repository.save(bean);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false, "Asignación registrada correctamente"), HttpStatus.CREATED);
    }

}
