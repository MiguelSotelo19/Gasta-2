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
    public ResponseEntity<ApiResponse> createSpace(EspacioBean espacioBean, Long idUsuario){
        Optional<EspacioBean> found = repository.findByNombre(espacioBean.getNombre());

        if(found.isPresent()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre de este espacio ya se encuentra registrado"), HttpStatus.BAD_REQUEST);
        }


        if(espacioBean.getNombre() == null || espacioBean.getNombre().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre del espacio no debe estar vacío"), HttpStatus.BAD_REQUEST);
        }

        String codigo = generarCodigoInvitacionUnico();
        espacioBean.setCodigoinvitacion(codigo);

        EspacioBean espacioGuardado = repository.saveAndFlush(espacioBean);

        Optional<UsuarioBean> optionalUsuarioBean = usuariosRepository.findById(idUsuario);
        if(optionalUsuarioBean.isEmpty()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El usuario no se encuentra registrado"), HttpStatus.BAD_REQUEST);
        }

        Optional<RolBean> optionalRolBean = rolRepository.findById(1L);
        if(optionalRolBean.isEmpty()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El rol no se encontro"), HttpStatus.BAD_REQUEST);
        }

        UsuariosEspaciosBean usuariosEspaciosBean = new UsuariosEspaciosBean();
        usuariosEspaciosBean.setEspacio(espacioGuardado);
        usuariosEspaciosBean.setUsuario(optionalUsuarioBean.get());
        usuariosEspaciosBean.setRol(optionalRolBean.get());
        usuariosEspaciosBean.setPorcentajeGasto(100.0);

        usuariosEspaciosService.AsignarEspaciosUsuarios(usuariosEspaciosBean);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false ,"Espacio creado y asignado correctamente"), HttpStatus.OK);
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



}
