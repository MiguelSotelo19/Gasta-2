package mx.edu.utez.gasta2.Controller.Usuarios_Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Espacios.DTO.EspacioIncompletoDTO;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO.AsignarPorcentajeDTO;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO.ChangeRolDTO;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.DTO.UnirseEspacioDTO;
import mx.edu.utez.gasta2.Service.Usuarios_Espacios.Usuarios_Espacio_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios-espacios")
public class Usuarios_Espacios_Controller {
    @Autowired
    private Usuarios_Espacio_Service service;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                new ApiResponse(null, HttpStatus.valueOf(400), "Errores de validación: " + String.join("; ", errors)),
                HttpStatus.BAD_REQUEST
        );
    }

    @PostMapping("/unirse")
    public ResponseEntity<ApiResponse> unirseAEspacio(@Validated(UnirseEspacioDTO.Join.class) @RequestBody UnirseEspacioDTO dto) {
        return service.unirseAEspacio(dto.getCodigoEspacio(), dto.getIdUsuario());
    }

    @PutMapping("/change-role")
    public ResponseEntity<ApiResponse> cambiarRol(@Validated(ChangeRolDTO.changeRole.class) @RequestBody ChangeRolDTO dto){
        return service.changeRolToAdmin(dto.getIdSpace(), dto.getIdAdmin(), dto.getIdUser());
    }

    // 2. Usuario sale de un espacio
    @DeleteMapping("/{idEspacio}/usuarios/{idUsuario}")
    public ResponseEntity<ApiResponse> salirDelEspacio(@PathVariable Long idEspacio, @PathVariable Long idUsuario) {
        return service.salirDeEspacio(idEspacio, idUsuario);
    }

    // 3. Calcular y reactivar espacio
    @PostMapping("/{idEspacio}/reasignar-porcentaje")
    public ResponseEntity<ApiResponse> recalcularPorcentaje(@PathVariable Long idEspacio) {
        return service.recalcularPorcentaje(idEspacio);
    }

    // 4. Obtener espacios con porcentaje faltante
    @GetMapping("/porcentaje-faltante")
    public ResponseEntity<ApiResponse> getEspaciosConPorcentajeFaltante() {
        List<EspacioIncompletoDTO> espacios = service.obtenerEspaciosIncompletos();
        return new ResponseEntity<>(
                new ApiResponse(espacios, HttpStatus.OK, "Espacios con porcentaje faltante"),
                HttpStatus.OK
        );
    }


    // 5. Asignar porcentaje faltante manualmente a un usuario
    @PostMapping("/{idEspacio}/usuarios/{idUsuario}/asignar-porcentaje")
    public ResponseEntity<ApiResponse> asignarPorcentajeManual(
            @PathVariable Long idEspacio,
            @PathVariable Long idUsuario,
            @RequestBody @Validated AsignarPorcentajeDTO dto) {
        return service.asignarPorcentajeManual(idEspacio, idUsuario, dto.getPorcentaje());
    }


}
