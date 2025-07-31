package mx.edu.utez.gasta2.Controller.Gastos;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Gastos.DTO.GastoDTO;
import mx.edu.utez.gasta2.Model.Gastos.DTO.GastoResponseDTO;
import mx.edu.utez.gasta2.Model.Gastos.GastoBean;
import mx.edu.utez.gasta2.Service.Gastos.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/espacio/{idEspacio}")
    public ResponseEntity<ApiResponse> getGastosPorEspacio(@PathVariable Long idEspacio) {
        List<GastoResponseDTO> gastos = gastoService.findAllByEspacioId(idEspacio);
        return ResponseEntity.ok(new ApiResponse(gastos, HttpStatus.OK, "Gastos del espacio"));
    }


}
