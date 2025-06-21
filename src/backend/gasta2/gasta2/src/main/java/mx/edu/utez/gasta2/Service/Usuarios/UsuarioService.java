package mx.edu.utez.gasta2.Service.Usuarios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuariosRepository repository;



    //Service para el registro de usuarios
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveUser(UsuarioBean usuario){

        //VALIDACIONES PARA INFORMACIÓN VACÍA
        if (usuario.getNombreusuario() == null || usuario.getNombreusuario().isEmpty() || usuario.getNombreusuario().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "El nombre de usuario NO debe estar vacío"), HttpStatus.FORBIDDEN);
        }

        if (usuario.getContrasenia() == null || usuario.getContrasenia().isEmpty() || usuario.getContrasenia().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "La contraseña NO debe estar vacía"), HttpStatus.FORBIDDEN);
        }

        if (usuario.getCorreo() == null || usuario.getCorreo().isEmpty() || usuario.getCorreo().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "El correo NO debe estar vacío"), HttpStatus.FORBIDDEN);
        }

        if (usuario.getEspaciosdisponibles() == null || usuario.getEspaciosdisponibles() != 5) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "La cantidad permitida de espacios son 5"), HttpStatus.FORBIDDEN);
        }


        //Búsqueda para identificar nombres de usuario y correos previamente registrados en la BD
        Optional<UsuarioBean> encontradoNombre = repository.findByNombreusuario(usuario.getNombreusuario());
        Optional<UsuarioBean> encontradoCorreo = repository.findByCorreo(usuario.getCorreo());

        if(encontradoNombre.isPresent()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "Este nombre de usuario ya se encuentra registrado"), HttpStatus.FORBIDDEN);
        }

        if(encontradoCorreo.isPresent()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "Este correo ya se encuentra registrado"), HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(new ApiResponse(repository.saveAndFlush(usuario), HttpStatus.CREATED, "Se ha registrado al usuario correctamente"), HttpStatus.CREATED);

    }
}
