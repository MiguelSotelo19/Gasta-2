package mx.edu.utez.gasta2.Controller.Pagos;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pagos")
public class PagosController {

    @Autowired
    private PagoService service;

    @GetMapping("/all/{idEspacio}")
    public ResponseEntity<ApiResponse> getAll(@PathVariable Long idEspacio){
        return service.getAll(idEspacio);
    }
}
