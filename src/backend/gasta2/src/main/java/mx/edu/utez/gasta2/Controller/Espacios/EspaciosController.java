package mx.edu.utez.gasta2.Controller.Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Espacios.DTO.EspacioDTO;
import mx.edu.utez.gasta2.Service.Espacios.EspaciosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/espacios")
public class EspaciosController {

    @Autowired
    private EspaciosService service;

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

    @GetMapping("/")
    public ResponseEntity<ApiResponse> all(){
        return service.getAll();
    }

    @PostMapping("/crear")
    public ResponseEntity<ApiResponse> create(@Validated(EspacioDTO.Register.class) @RequestBody EspacioDTO dto) {
        return service.createSpace(dto.toEntity(), dto.getIdUsuario());
    }

}
