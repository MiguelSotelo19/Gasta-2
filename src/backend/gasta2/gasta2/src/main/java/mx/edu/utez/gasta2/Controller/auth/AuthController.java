package mx.edu.utez.gasta2.Controller.auth;


import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Controller.auth.dto.SignDto;
import mx.edu.utez.gasta2.Service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"*"})
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> signIn(@RequestBody SignDto dto) {
        return service.signIn(dto.getCorreo(), dto.getPassword());
    }
}
