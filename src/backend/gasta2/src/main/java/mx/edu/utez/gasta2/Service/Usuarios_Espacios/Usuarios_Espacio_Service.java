package mx.edu.utez.gasta2.Service.Usuarios_Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Espacios.DTO.EspacioIncompletoDTO;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Espacios.EspaciosRepository;
import mx.edu.utez.gasta2.Model.Roles.RolBean;
import mx.edu.utez.gasta2.Model.Roles.RolRepository;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO.PorcentajeAsignacionDTO;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO.PorcentajesRequestDTO;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO.UsuariosEspaciosDTO;
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
import java.util.Set;
import java.util.stream.Collectors;

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

    public ResponseEntity<ApiResponse> getAllByUsuario(Long idUsuario) {
        List<UsuariosEspaciosDTO> dtos = repository.findAllByUsuario_Id(idUsuario)
                .stream()
                .map(UsuariosEspaciosDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse(dtos, HttpStatus.OK, "Usuarios encontrados"));
    }

    public ResponseEntity<ApiResponse> getAll() {
        List<UsuariosEspaciosDTO> dtos = repository.findAll()
                .stream()
                .map(UsuariosEspaciosDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse(dtos, HttpStatus.OK, "Todos los usuarios-espacios encontrados"));
    }



    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> AsignarEspaciosUsuarios(UsuariosEspaciosBean bean) {
        // Validar usuario
        if (bean.getUsuario() == null || bean.getUsuario().getId() == null) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El ID del usuario no debe ser vacío"), HttpStatus.BAD_REQUEST);
        }

        // Validar rol
        if (bean.getRol() == null || bean.getRol().getId() == null) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El ID del rol no debe ser vacío"), HttpStatus.BAD_REQUEST);
        }

        // Si se incluye espacio, validar su ID
        if (bean.getEspacio() != null && bean.getEspacio().getId() == null) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El ID del espacio no debe ser nulo si se proporciona un espacio"), HttpStatus.BAD_REQUEST);
        }

        // Si se incluye porcentaje de gasto, validar su rango
        if (bean.getPorcentajeGasto() != null && (bean.getPorcentajeGasto() <= 0 || bean.getPorcentajeGasto() > 100)) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El porcentaje de gasto no es válido"), HttpStatus.BAD_REQUEST);
        }

        repository.save(bean);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false, "Asignación registrada correctamente"), HttpStatus.CREATED);
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> unirseAEspacio(String codigo, Long idUsuario) {
        // Buscar el espacio por el código
        Optional<EspacioBean> espacioOptional = espaciosRepository.findByCodigoinvitacion(codigo);
        if (espacioOptional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Código inválido"), HttpStatus.NOT_FOUND);
        }
        EspacioBean espacio = espacioOptional.get();

        // Verificar que el usuario existe
        Optional<UsuarioBean> usuarioOptional = usuariosRepository.findById(idUsuario);
        if (usuarioOptional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"), HttpStatus.NOT_FOUND);
        }
        UsuarioBean usuario = usuarioOptional.get();

        // Verificar si ya está en ese espacio
        Optional<UsuariosEspaciosBean> yaMiembro = repository.findByUsuarioAndEspacio(usuario, espacio);
        if (yaMiembro.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.CONFLICT, true, "Ya estás en este espacio"), HttpStatus.CONFLICT);
        }

        // Obtener el rol de Invitado (id = 2)
        RolBean rolInvitado = rolRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol de invitado no encontrado"));

        // Obtener miembros actuales del espacio
        List<UsuariosEspaciosBean> miembrosActuales = repository.findAllByEspacio(espacio);
        int totalUsuarios = miembrosActuales.size() + 1;
        double nuevoPorcentaje = Math.round((100.0 / totalUsuarios) * 100.0) / 100.0;

        // Recalcular porcentaje para todos los miembros
        for (UsuariosEspaciosBean miembro : miembrosActuales) {
            miembro.setPorcentajeGasto(nuevoPorcentaje);
            repository.save(miembro);
        }

        // Buscar si ya existe una relación sin espacio (por registro)
        Optional<UsuariosEspaciosBean> relacionExistente = repository.findByUsuarioAndEspacioIsNull(usuario);

        if (relacionExistente.isPresent()) {
            UsuariosEspaciosBean relacion = relacionExistente.get();
            relacion.setEspacio(espacio);
            relacion.setRol(rolInvitado);
            relacion.setPorcentajeGasto(nuevoPorcentaje);
            repository.save(relacion);
        } else {
            // Si no tiene relación previa, se crea una nueva (por si acaso)
            UsuariosEspaciosBean nuevoMiembro = new UsuariosEspaciosBean(usuario, espacio, rolInvitado, nuevoPorcentaje);
            repository.save(nuevoMiembro);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false, "Te uniste correctamente al espacio"), HttpStatus.CREATED);
    }


    //Cambiar el rol del usuario
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> changeRolToAdmin(Long idEspacio, Long idAdmin, Long idUser) {

        // Validar que el admin no se cambie solito su rol
        if (idAdmin.equals(idUser)) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "No puedes cambiar tu propio rol"), HttpStatus.FORBIDDEN);
        }

        // Validar que el admin si sea admin xd
        Optional<UsuariosEspaciosBean> adminEnEspacio = repository.findByUsuarioIdAndEspacioId(idAdmin, idEspacio);
        if (adminEnEspacio.isEmpty() || adminEnEspacio.get().getRol().getId() != 1L) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "No tienes permisos para cambiar roles en este espacio"), HttpStatus.FORBIDDEN);
        }

        // Buscar el usuario
        Optional<UsuariosEspaciosBean> usuarioEnEspacio = repository.findByUsuarioIdAndEspacioId(idUser, idEspacio);
        if (usuarioEnEspacio.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "El usuario no se encuentra en este espacio"), HttpStatus.NOT_FOUND);
        }

        // Obtener el rol de admin (OSEA EL 1)
        Optional<RolBean> rolAdmin = rolRepository.findById(1L);
        if (rolAdmin.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Rol de administrador no encontrado"), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Cambiar el rol del usuario a admin (DE 2 A 1)
        UsuariosEspaciosBean usuarioEspacio = usuarioEnEspacio.get();
        usuarioEspacio.setRol(rolAdmin.get());
        repository.save(usuarioEspacio);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Rol cambiado a administrador correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse> salirDeEspacio(Long idEspacio, Long idUsuario) {
        Optional<UsuarioBean> usuarioOpt = usuariosRepository.findById(idUsuario);
        Optional<EspacioBean> espacioOpt = espaciosRepository.findById(idEspacio);

        if (usuarioOpt.isEmpty() || espacioOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario o espacio no encontrado"), HttpStatus.NOT_FOUND);
        }

        UsuarioBean usuario = usuarioOpt.get();
        EspacioBean espacio = espacioOpt.get();

        // Buscar relación actual
        Optional<UsuariosEspaciosBean> relacionOpt = repository.findByUsuarioAndEspacio(usuario, espacio);
        if (relacionOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Relación no encontrada"), HttpStatus.NOT_FOUND);
        }

        UsuariosEspaciosBean relacion = relacionOpt.get();

        // ⚡ Eliminar posibles duplicados de relaciones con espacio = null
        List<UsuariosEspaciosBean> duplicados = repository.findAllByUsuarioAndEspacioIsNull(usuario);
        for (UsuariosEspaciosBean dup : duplicados) {
            if (!dup.getId().equals(relacion.getId())) {
                repository.delete(dup);
            }
        }

        // Desvincular relación actual
        relacion.setEspacio(null);
        relacion.setPorcentajeGasto(null);
        repository.save(relacion);

        // Marcar espacio como inactivo
        espacio.setStatus(false);
        espaciosRepository.save(espacio);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Usuario eliminado y espacio desactivado"), HttpStatus.OK);
    }



    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse> recalcularPorcentaje(Long idEspacio) {
        Optional<EspacioBean> espacioOpt = espaciosRepository.findById(idEspacio);
        if (espacioOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Espacio no encontrado"), HttpStatus.NOT_FOUND);
        }

        EspacioBean espacio = espacioOpt.get();
        List<UsuariosEspaciosBean> miembros = repository.findAllByEspacio(espacio);

        if (miembros.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "No hay miembros en el espacio"), HttpStatus.BAD_REQUEST);
        }

        double nuevoPorcentaje = 100.0 / miembros.size();
        for (UsuariosEspaciosBean miembro : miembros) {
            miembro.setPorcentajeGasto(Math.round(nuevoPorcentaje * 100.0) / 100.0); // 2 decimales
            repository.save(miembro);
        }

        // Activar espacio
        espacio.setStatus(true);
        espaciosRepository.save(espacio);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Porcentajes recalculados y espacio reactivado"), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public List<EspacioIncompletoDTO> obtenerEspaciosIncompletos() {
        List<EspacioBean> espaciosInactivos = espaciosRepository.findByStatusFalse();

        return espaciosInactivos.stream()
                .map(espacio -> {
                    List<UsuariosEspaciosBean> relaciones = repository.findAllByEspacio(espacio);
                    double suma = relaciones.stream()
                            .mapToDouble(r -> r.getPorcentajeGasto() != null ? r.getPorcentajeGasto() : 0)
                            .sum();
                    double faltante = 100.0 - suma;
                    return new EspacioIncompletoDTO(espacio, faltante);
                })
                .filter(dto -> dto.getPorcentajeFaltante() > 0)
                .toList();
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse> asignarPorcentajeManual(Long idEspacio, Long idUsuario, double porcentaje) {
        Optional<EspacioBean> espacioOpt = espaciosRepository.findById(idEspacio);
        Optional<UsuarioBean> usuarioOpt = usuariosRepository.findById(idUsuario);

        if (espacioOpt.isEmpty() || usuarioOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario o espacio no encontrado"), HttpStatus.NOT_FOUND);
        }

        EspacioBean espacio = espacioOpt.get();
        UsuarioBean usuario = usuarioOpt.get();

        Optional<UsuariosEspaciosBean> relacionOpt = repository.findByUsuarioAndEspacio(usuario, espacio);
        if (relacionOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Relación usuario-espacio no encontrada"), HttpStatus.NOT_FOUND);
        }

        UsuariosEspaciosBean relacion = relacionOpt.get();

        double porcentajeActual = relacion.getPorcentajeGasto() != null ? relacion.getPorcentajeGasto() : 0;
        double nuevoPorcentaje = Math.round((porcentajeActual + porcentaje) * 100.0) / 100.0;

        relacion.setPorcentajeGasto(nuevoPorcentaje);
        repository.save(relacion);

        // Verificar si ya suman 100
        List<UsuariosEspaciosBean> relaciones = repository.findAllByEspacio(espacio);
        double suma = relaciones.stream()
                .mapToDouble(r -> r.getPorcentajeGasto() != null ? r.getPorcentajeGasto() : 0)
                .sum();

        if (Math.round(suma * 100.0) / 100.0 == 100.0) {
            espacio.setStatus(true);
            espaciosRepository.save(espacio);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Porcentaje asignado correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse> asignarPorcentajesManuales(PorcentajesRequestDTO request) {
        Optional<EspacioBean> espacioOpt = espaciosRepository.findById(request.getIdEspacio());
        if (espacioOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Espacio no encontrado"), HttpStatus.NOT_FOUND);
        }

        EspacioBean espacio = espacioOpt.get();

        // Obtener todos los usuarios que pertenecen al espacio
        List<UsuariosEspaciosBean> participantes = repository.findAllByEspacio(espacio);

        // Validar que se asignaron porcentajes a todos los usuarios del espacio
        Set<Long> idsEnRequest = request.getAsignaciones().stream()
                .map(PorcentajeAsignacionDTO::getIdUsuario)
                .collect(Collectors.toSet());

        List<Long> idsFaltantes = participantes.stream()
                .map(ueb -> ueb.getUsuario().getId())
                .filter(id -> !idsEnRequest.contains(id))
                .collect(Collectors.toList());

        if (!idsFaltantes.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true,
                    "Faltan usuarios del espacio en la asignación: " + idsFaltantes), HttpStatus.BAD_REQUEST);
        }

        double sumaTotal = request.getAsignaciones().stream()
                .mapToDouble(PorcentajeAsignacionDTO::getPorcentaje)
                .sum();

        // Validar que sumen exactamente 100
        if (Math.round(sumaTotal * 100.0) / 100.0 != 100.0) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "La suma total debe ser 100%"), HttpStatus.BAD_REQUEST);
        }


        // Actualizar cada relación
        for (PorcentajeAsignacionDTO dto : request.getAsignaciones()) {
            Optional<UsuarioBean> usuarioOpt = usuariosRepository.findById(dto.getIdUsuario());
            if (usuarioOpt.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario con ID " + dto.getIdUsuario() + " no encontrado"), HttpStatus.NOT_FOUND);
            }

            Optional<UsuariosEspaciosBean> relacionOpt = repository.findByUsuarioAndEspacio(usuarioOpt.get(), espacio);
            if (relacionOpt.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Relación no encontrada para el usuario ID " + dto.getIdUsuario()), HttpStatus.NOT_FOUND);
            }

            UsuariosEspaciosBean relacion = relacionOpt.get();
            relacion.setPorcentajeGasto(Math.round(dto.getPorcentaje() * 100.0) / 100.0);
            repository.save(relacion);
        }

        espacio.setStatus(true); // Reactivar espacio
        espaciosRepository.save(espacio);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Porcentajes asignados correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> allBySpace(Long idEspacio){
        Optional<EspacioBean> findSpace = espaciosRepository.findById(idEspacio);

        if(findSpace.isPresent()){
            return new ResponseEntity<>(new ApiResponse(repository.findUsuariosByEspacioId(idEspacio), HttpStatus.OK, "Todos los usuarios en el espacio con ID: " +idEspacio), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "El espacio no fue encontrado"), HttpStatus.NOT_FOUND);
    }
}
