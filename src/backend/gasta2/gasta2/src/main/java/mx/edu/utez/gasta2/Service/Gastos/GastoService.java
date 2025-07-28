package mx.edu.utez.gasta2.Service.Gastos;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaRepository;
import mx.edu.utez.gasta2.Model.Espacios.EspaciosRepository;
import mx.edu.utez.gasta2.Model.Gastos.DTO.GastoDTO;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;
import mx.edu.utez.gasta2.Model.Gastos.GastoRepository;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UserEspaciosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private EspaciosRepository espaciosRepository;

    @Autowired
    private UserEspaciosRepository userEspaciosRepository;

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<ApiResponse> registrarGasto(GastoDTO dto) {

        if (dto.getCantidad() <= 0){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "La cantidad debe ser mayor a cero"), HttpStatus.BAD_REQUEST);
        }

        var usuario = usuariosRepository.findById(dto.getIdUsuario());
        var categoria = categoriaRepository.findById(dto.getIdCategoria());
        var espacio = espaciosRepository.findById(dto.getIdEspacio());

        if (usuario.isEmpty() || categoria.isEmpty() || espacio.isEmpty()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true,"Usuario, categoria o espacio no encontrados"),HttpStatus.NOT_FOUND);
        }

        //Validar si la categoria pertenece al espacio
        boolean categoriaValida = categoriaRepository.existsByIdAndEspacio_Id(dto.getIdCategoria(), dto.getIdEspacio());
        if (!categoriaValida) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "La categoría no pertenece al espacio."), HttpStatus.BAD_REQUEST);
        }

        //Verificar si el usuario pertenec al espacio
        boolean pertenece = userEspaciosRepository.existsByUsuario_IdAndEspacio_Id(dto.getIdUsuario(), dto.getIdEspacio());
        if (!pertenece){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true,"El usuario no pertenece al espacio indicado"),HttpStatus.FORBIDDEN);
        }

        //Registro
        GastoBean gasto = new GastoBean();
        gasto.setCantidad(dto.getCantidad());
        gasto.setDescripcion(dto.getDescripcion());
        gasto.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        gasto.setUsuario(usuario.get());
        gasto.setTipogasto(categoria.get());

        gastoRepository.save(gasto);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, true, "Gasto registrado correctamente"),HttpStatus.CREATED);
    }

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<ApiResponse> editarGasto(Long idGasto, GastoDTO dto) {
        Optional<GastoBean> optional = gastoRepository.findById(idGasto);

        if (optional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Gasto no encontrado"), HttpStatus.NOT_FOUND);
        }

        if (dto.getCantidad() <= 0) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "La cantidad debe ser mayor a cero"), HttpStatus.BAD_REQUEST);
        }

        var gasto = optional.get();

        // Verificar que el gasto pertenezca al espacio indicado
        Long espacioDelGasto = gasto.getTipogasto().getEspacio().getId();  // espacio real del gasto (a través de la categoría actual)

        // Valida que el usuario sea admin en ese espacio
        boolean esAdmin = userEspaciosRepository.existsByUsuario_IdAndEspacio_IdAndRol_Rol(dto.getIdUsuario(), espacioDelGasto, "Administrador");

        if (!esAdmin) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "Solo los administradores del espacio pueden editar este gasto"), HttpStatus.FORBIDDEN);
        }

        // Valida que la nueva categoría pertenezca al mismo espacio
        boolean categoriaValida = categoriaRepository.existsByIdAndEspacio_Id(dto.getIdCategoria(), espacioDelGasto);

        if (!categoriaValida) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "La categoría no pertenece al mismo espacio del gasto"), HttpStatus.BAD_REQUEST);
        }

        // Actualizar los datos del gasto
        var categoriaOpt = categoriaRepository.findById(dto.getIdCategoria());
        if (categoriaOpt.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Categoría no encontrada"), HttpStatus.NOT_FOUND);
        }

        gasto.setCantidad(dto.getCantidad());
        gasto.setDescripcion(dto.getDescripcion());
        gasto.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        gasto.setTipogasto(categoriaOpt.get());

        gastoRepository.save(gasto);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Gasto actualizado correctamente"), HttpStatus.OK);
    }


}
