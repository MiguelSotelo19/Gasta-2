package mx.edu.utez.gasta2.Service.Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Espacios.EspaciosRepository;
import mx.edu.utez.gasta2.Model.Roles.RolBean;
import mx.edu.utez.gasta2.Model.Roles.RolRepository;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;
import mx.edu.utez.gasta2.Service.Usuarios.UsuarioService;
import mx.edu.utez.gasta2.Service.Usuarios_Espacios.Usuarios_Espacio_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
public class EspaciosService {

    @Autowired
    private EspaciosRepository repository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private Usuarios_Espacio_Service usuariosEspaciosService;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(){
        return new ResponseEntity<>(new ApiResponse(repository.findAll(), HttpStatus.OK, "Todos los espacios obtenidos"), HttpStatus.OK);

    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> createSpace(EspacioBean espacioBean, Long idUsuario) {
        Optional<EspacioBean> found = repository.findByNombre(espacioBean.getNombre());
        if (found.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre de este espacio ya se encuentra registrado"), HttpStatus.BAD_REQUEST);
        }

        if (espacioBean.getNombre() == null || espacioBean.getNombre().isBlank()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre del espacio no debe estar vacío"), HttpStatus.BAD_REQUEST);
        }

        String codigo = generarCodigoInvitacionUnico();
        espacioBean.setCodigoinvitacion(codigo);

        EspacioBean espacioGuardado = repository.saveAndFlush(espacioBean);

        Optional<UsuarioBean> optionalUsuarioBean = usuariosRepository.findById(idUsuario);
        if (optionalUsuarioBean.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El usuario no se encuentra registrado"), HttpStatus.BAD_REQUEST);
        }

        UsuarioBean user = optionalUsuarioBean.get();

        if (user.getEspaciosdisponibles() == null || user.getEspaciosdisponibles() < 1) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "El usuario ya no cuenta con espacios disponibles"), HttpStatus.FORBIDDEN);
        }

        // Restar un espacio disponible
        user.setEspaciosdisponibles(user.getEspaciosdisponibles() - 1);
        usuariosRepository.save(user);

        Optional<RolBean> optionalRolBean = rolRepository.findById(1L); // Rol de admin
        if (optionalRolBean.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El rol no se encontró"), HttpStatus.BAD_REQUEST);
        }

        UsuariosEspaciosBean usuariosEspaciosBean = new UsuariosEspaciosBean();
        usuariosEspaciosBean.setEspacio(espacioGuardado);
        usuariosEspaciosBean.setUsuario(user);
        usuariosEspaciosBean.setRol(optionalRolBean.get());
        usuariosEspaciosBean.setPorcentajeGasto(100.0);

        usuariosEspaciosService.AsignarEspaciosUsuarios(usuariosEspaciosBean);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false, "Espacio creado y asignado correctamente"), HttpStatus.CREATED);
    }



    public String generarCodigoInvitacionUnico() {
        String codigo;
        do {
            int numero = (int) (Math.random() * 90000) + 10000;
            codigo = String.valueOf(numero);
            System.out.println(codigo);
        } while (repository.existsByCodigoinvitacion(codigo));
        return codigo;
    }

    //unirse a un espacio

//    @Transactional(rollbackFor = {SQLException.class})
//    public ResponseEntity<ApiResponse> JoinSpace(String codigo, Long idUsuario){
//        Optional<EspacioBean> foundCode = repository.findByCodigoinvitacion(codigo);
//
//        if(foundCode.isPresent()){
//
//            EspacioBean espacioBean = foundCode.get();
//            Optional<UsuarioBean> foundUser = usuariosRepository.findById(idUsuario);
//
//            if(foundUser.isPresent()){
//                Optional<RolBean> rolBean = rolRepository.findById(2L);
//                UsuarioBean user = foundUser.get();
//                UsuariosEspaciosBean usuariosEspaciosBean = new UsuariosEspaciosBean();
//                usuariosEspaciosBean.setEspacio(espacioBean);
//                usuariosEspaciosBean.setUsuario(user);
//                usuariosEspaciosBean.setRol(rolBean.get());
//                //usuariosEspaciosBean.setPorcentajeGasto(); NECESITO QUE EL PORCENTAJE SE DIVIDA EQUITATIVAMENTE ENTRE EL NUMERO DE PERSONAS QUE SE ENCUNENTREN EN EL MISMO ESPACIO
//                usuariosEspaciosService.AsignarEspaciosUsuarios(usuariosEspaciosBean);
//            }
//        }
//
//        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "El espacio no fue encontrado"), HttpStatus.NOT_FOUND);
//    }



}
