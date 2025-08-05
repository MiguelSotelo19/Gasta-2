package mx.edu.utez.gasta2.Controller.Categorias;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Categorias.DTO.CategoriaDTO;
import mx.edu.utez.gasta2.Service.Categorias.CategoriaService;
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
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService service;

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

    @GetMapping("/{idEspacio}")
    public ResponseEntity<ApiResponse> allCategoriesByID(@PathVariable Long idEspacio){
        return service.getAllByID(idEspacio);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> saveCategory(@Validated(CategoriaDTO.Register.class) @RequestBody CategoriaDTO dto){
        return service.saveCategory(dto.toEntity());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateCategory(
            @PathVariable Long id,
            @Validated(CategoriaDTO.Update.class) @RequestBody CategoriaDTO dto
    ) {
        return service.updateCategory(id, dto.toEntity());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
        return service.deleteCategory(id);
    }


}
