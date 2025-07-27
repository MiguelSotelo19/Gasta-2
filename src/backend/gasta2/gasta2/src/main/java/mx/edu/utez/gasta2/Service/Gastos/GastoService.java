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

}
