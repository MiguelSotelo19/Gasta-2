package mx.edu.utez.gasta2.Service.auth;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.security.jwt.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@Transactional
public class AuthService {
    //private final PersonaService userService;
    private final UsuariosRepository personaRepository;
    private final JwtProvider provider;
    private final AuthenticationManager manager;

    public AuthService(UsuariosRepository personaRepository, JwtProvider provider, AuthenticationManager manager) {
        this.personaRepository = personaRepository;
        this.provider = provider;
        this.manager = manager;
    }

    @Transactional
    public ResponseEntity<ApiResponse> signIn(String correo, String password) {
        try {
            Optional<UsuarioBean> foundUser = personaRepository.findByCorreo(correo);
            if (foundUser.isEmpty())
                return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true,"UserNotFound"), HttpStatus.BAD_REQUEST);
            UsuarioBean user = foundUser.get();

            Authentication auth = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(correo, password)
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = provider.generateToken(auth);
            // Payload - DTO (token, attrs)

            return new ResponseEntity<>(new ApiResponse(token, HttpStatus.OK,"Token generado"), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "CredentialsMismatch";
            if (e instanceof DisabledException)
                message = "UserDisabled";
            if (e instanceof AccountExpiredException)
                message = "Expiro";
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST,true, message), HttpStatus.UNAUTHORIZED);
        }
    }
}
