package mx.edu.utez.gasta2.Controller.Usuarios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Usuarios.DTO.UsuarioDTO;
import mx.edu.utez.gasta2.Service.Usuarios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/usuarios")
public class UsuariosController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/registrar")
    public ResponseEntity<ApiResponse> registrarUsuario(@RequestBody UsuarioDTO dto){
        return service.saveUser(dto.toEntity());
    }
}
