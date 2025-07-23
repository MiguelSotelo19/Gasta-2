package mx.edu.utez.gasta2.Controller.Usuarios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.PasswordReset.DTO.CodeDTO;
import mx.edu.utez.gasta2.Model.PasswordReset.DTO.PasswordResetDTO;
import mx.edu.utez.gasta2.Model.Usuarios.DTO.CorreoDTO;
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

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllUsuarios() {
        return service.getAllUsers();
    }

    @PostMapping("/registrar")
    public ResponseEntity<ApiResponse> registrarUsuario(@RequestBody UsuarioDTO dto){
        return service.saveUser(dto.toEntity());
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verificarEmail(@RequestBody CorreoDTO dto) throws Exception {
        return service.VerifyEmail(dto.getCorreo());
    }

    @PostMapping("/verify/code")
    public ResponseEntity<ApiResponse> verificarCodigo(@RequestBody CodeDTO dto) {
        return service.verifyCode(dto.getCorreo(), dto.getCodigo());
    }

    @PutMapping("/verify/reset")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody PasswordResetDTO dto) {
        return service.newPassword(dto.getCorreo(), dto.getCodigo(), dto.getPassword());
    }
}
