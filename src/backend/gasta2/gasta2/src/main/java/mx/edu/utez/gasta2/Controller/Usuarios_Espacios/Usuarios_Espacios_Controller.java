package mx.edu.utez.gasta2.Controller.Usuarios_Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
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
}
