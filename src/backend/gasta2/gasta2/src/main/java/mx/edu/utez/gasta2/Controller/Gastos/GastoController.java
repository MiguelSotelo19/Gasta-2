package mx.edu.utez.gasta2.Controller.Gastos;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Gastos.DTO.GastoDTO;
import mx.edu.utez.gasta2.Service.Gastos.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired
    private GastoService gastoService;

    @PostMapping("/registrar")
    public  ResponseEntity<ApiResponse> registrarGasto(@RequestBody GastoDTO dto) {
        return gastoService.registrarGasto(dto);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<ApiResponse> editarGasto(@PathVariable("id") Long id, @RequestBody GastoDTO dto) {
        return gastoService.editarGasto(id, dto);
    }
}
