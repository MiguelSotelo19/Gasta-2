package mx.edu.utez.gasta2.Service.Usuarios_Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Espacios.EspaciosRepository;
import mx.edu.utez.gasta2.Model.Roles.RolBean;
import mx.edu.utez.gasta2.Model.Roles.RolRepository;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UserEspaciosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class Usuarios_Espacio_Service {

    @Autowired
    private UserEspaciosRepository repository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private EspaciosRepository espaciosRepository;

    @Autowired
    private RolRepository rolRepository;

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

    public ResponseEntity<ApiResponse> unirseAEspacio(String codigo, Long idUsuario) {
        // Busca el espacio por el cpdigo
        Optional<EspacioBean> espacioOptional = espaciosRepository.findByCodigoinvitacion(codigo);
        if (espacioOptional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Código inválido"), HttpStatus.NOT_FOUND);
        }
        EspacioBean espacio = espacioOptional.get();

        //Verifica que el usuario exista
        Optional<UsuarioBean> usuarioOptional = usuariosRepository.findById(idUsuario);
        if (usuarioOptional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"), HttpStatus.NOT_FOUND);
        }
        UsuarioBean usuario = usuarioOptional.get();

        // Verificar que no este ya unido
        boolean yaExiste = repository.existsByUsuarioAndEspacio(usuario, espacio);
        if (yaExiste) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.CONFLICT, true, "Ya estás en este espacio"), HttpStatus.CONFLICT);
        }

        //Obtener el rol de invitado
        RolBean rolInvitado = rolRepository.findById(2L).orElseThrow(() -> new RuntimeException("Rol invitado no encontrado"));

        // alcular el nuevo porcentaje para todos 😭
        List<UsuariosEspaciosBean> miembrosActuales = repository.findAllByEspacio(espacio);
        int totalUsuarios = miembrosActuales.size() + 1;
        double nuevoPorcentaje = 100.0 / totalUsuarios;

        // Actualizar porcentaje de todos 😭😭
        for (UsuariosEspaciosBean miembro : miembrosActuales) {
            miembro.setPorcentajeGasto(nuevoPorcentaje);
            repository.save(miembro);
        }

        UsuariosEspaciosBean nuevo = new UsuariosEspaciosBean(usuario, espacio, rolInvitado, nuevoPorcentaje);
        repository.save(nuevo);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false, "Te uniste correctamente al espacio"), HttpStatus.CREATED);
    }


}
