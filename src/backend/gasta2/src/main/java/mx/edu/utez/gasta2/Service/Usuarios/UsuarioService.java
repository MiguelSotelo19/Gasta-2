package mx.edu.utez.gasta2.Service.Usuarios;

import jakarta.mail.internet.MimeMessage;
import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaRepository;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Espacios.EspaciosRepository;
import mx.edu.utez.gasta2.Model.Gastos.GastoRepository;
import mx.edu.utez.gasta2.Model.Pagos.PagosRepository;
import mx.edu.utez.gasta2.Model.PasswordReset.PasswordReset;
import mx.edu.utez.gasta2.Model.PasswordReset.PasswordResetRepository;
import mx.edu.utez.gasta2.Model.Roles.RolBean;
import mx.edu.utez.gasta2.Model.Roles.RolRepository;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UserEspaciosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;
import mx.edu.utez.gasta2.Service.Usuarios_Espacios.Usuarios_Espacio_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuariosRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String codigo = "";

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordResetRepository resetRepository;

    @Autowired
    private Usuarios_Espacio_Service usuarios_espacio_service;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UserEspaciosRepository userEspaciosRepository;

    @Autowired
    private EspaciosRepository espaciosRepository;


    @Autowired
    private PagosRepository pagoRepository;
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UsuarioBean> usuarios = repository.findAll();
        return new ResponseEntity<>(new ApiResponse(usuarios, HttpStatus.OK, "Usuarios encontrados"), HttpStatus.OK);
    }

    //Service para el registro de usuarios
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> saveUser(UsuarioBean usuario){

        //VALIDACIONES PARA INFORMACIÓN VACÍA
        if (usuario.getNombreusuario() == null || usuario.getNombreusuario().isEmpty() || usuario.getNombreusuario().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "El nombre de usuario NO debe estar vacío"), HttpStatus.FORBIDDEN);
        }

        if (usuario.getContrasenia() == null || usuario.getContrasenia().isEmpty() || usuario.getContrasenia().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "La contraseña NO debe estar vacía"), HttpStatus.FORBIDDEN);
        }

        if (usuario.getCorreo() == null || usuario.getCorreo().isEmpty() || usuario.getCorreo().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "El correo NO debe estar vacío"), HttpStatus.FORBIDDEN);
        }

        if (usuario.getEspaciosdisponibles() == null || usuario.getEspaciosdisponibles() != 5) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "La cantidad permitida de espacios son 5"), HttpStatus.FORBIDDEN);
        }


        //Búsqueda para identificar nombres de usuario y correos previamente registrados en la BD
        Optional<UsuarioBean> encontradoNombre = repository.findByNombreusuario(usuario.getNombreusuario());
        Optional<UsuarioBean> encontradoCorreo = repository.findByCorreo(usuario.getCorreo());

        if(encontradoNombre.isPresent()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "Este nombre de usuario ya se encuentra registrado"), HttpStatus.FORBIDDEN);
        }

        if(encontradoCorreo.isPresent()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN, true, "Este correo ya se encuentra registrado"), HttpStatus.FORBIDDEN);
        }

        String encrypted = passwordEncoder.encode(usuario.getContrasenia());
        usuario.setContrasenia(encrypted);

        repository.saveAndFlush(usuario);

        UsuariosEspaciosBean UE = new UsuariosEspaciosBean();
        Optional<RolBean> rol = rolRepository.findById(1L);

        UE.setUsuario(usuario);
        UE.setRol(rol.get());

        usuarios_espacio_service.AsignarEspaciosUsuarios(UE);


        return new ResponseEntity<>(new ApiResponse( HttpStatus.CREATED, false,"Se ha registrado al usuario correctamente"), HttpStatus.CREATED);

    }

    @Transactional
    public ResponseEntity<ApiResponse> VerifyEmail(String email) throws Exception {
        Optional<UsuarioBean> find = repository.findByCorreo(email);
        if (find.isPresent()) {

            List<PasswordReset> codigosViejos = resetRepository.findAllByEmailAndUsedFalse(email);
            for (PasswordReset viejo : codigosViejos) {
                viejo.setUsed(true);
            }
            resetRepository.saveAll(codigosViejos);

            String codigo = GenerarCodigo();

            PasswordReset token = new PasswordReset();
            token.setEmail(email);
            token.setCode(codigo);
            token.setExpiration(LocalDateTime.now().plusMinutes(5));
            token.setUsed(false);
            resetRepository.save(token);

            enviarCorreo(email, codigo);
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false,"Código enviado"), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, false, "Usuario no encontrado"), HttpStatus.NOT_FOUND);
    }


    @Transactional
    public ResponseEntity<ApiResponse> newPassword(String email, String code, String password) {
        Optional<PasswordReset> tokenOpt = resetRepository.findByEmailAndCodeAndUsedFalse(email, code.trim());
        if (tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(LocalDateTime.now())) {
            Optional<UsuarioBean> userOpt = repository.findByCorreo(email);
            if (userOpt.isPresent()) {
                UsuarioBean user = userOpt.get();
                user.setContrasenia(passwordEncoder.encode(password));
                repository.save(user);

                PasswordReset token = tokenOpt.get();
                token.setUsed(true);
                resetRepository.save(token);

                return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Contraseña reestablecida"), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Código inválido o expirado"), HttpStatus.BAD_REQUEST);
    }


    public ResponseEntity<ApiResponse> verifyCode(String email, String code) {
        Optional<PasswordReset> tokenOpt = resetRepository.findByEmailAndCodeAndUsedFalse(email, code.trim());
        if (tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(LocalDateTime.now())) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Código válido"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Código no válido o expirado"), HttpStatus.BAD_REQUEST);
    }
    public String GenerarCodigo() {
        codigo = ""; // reiniciar
        for (int i = 0; i < 6; i++) {
            int digito = (int) (Math.random() * 10);
            codigo += digito;
        }

        System.out.println("el codigo es: " + codigo);
        return codigo;
    }

    public void enviarCorreo(String correo, String codigo)
            throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(correo);
        helper.setFrom("sgep.recuperar.contra@gmail.com");
        helper.setSubject("Código de recuperación de contraseña");

        String htmlContent =
                "<div style='background-color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto; "
                        + "border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;'>"
                        + "<h1 style='text-align: center; font-weight: bold;'>¡Hola!</h1>"
                        + "<p style='font-weight: bold; text-align: center;'>¡Esperamos que estés bien!</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Este es un correo de parte del sistema GASTA-2 para darte tu código de verificación.</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Tu código es:</p>"
                        + "<div style='background-color: #f8f9fa; padding: 18px; border-radius: 10px; "
                        + "box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: inline-block; "
                        + "font-size: 32px; font-weight: bold; letter-spacing: 10px; text-align: center; "
                        + "margin: 20px auto; width: 100%;'>"
                        + codigo
                        + "</div>"
                        + "<p style='font-size: 18px; text-align: center;'>¡Asegurate de no perderlo!</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Gracias uwu.</p>"
                        + "</div>";



        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    @Transactional
    public ResponseEntity<ApiResponse> eliminarCuenta(Long idUsuario) {
        Optional<UsuarioBean> userFound = repository.findById(idUsuario);
        if (userFound.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"), HttpStatus.NOT_FOUND);
        }

        UsuarioBean usuario = userFound.get();

        // Elimina pagos del usuario (opcional, si quieres limpiar sus deudas también)
        pagoRepository.deleteAllByUsuarioId(usuario.getId());

        // Elimina espacios creados por el usuario
        List<UsuariosEspaciosBean> creados = userEspaciosRepository.findAllByUsuarioAndRolRol(usuario, "Administrador");

        for (UsuariosEspaciosBean relacion : creados) {
            EspacioBean espacio = relacion.getEspacio();

            // Elimina categorías del espacio
            categoriaRepository.deleteByEspacioId(espacio.getId());

            // Elimina relaciones usuarios_espacios del espacio
            userEspaciosRepository.deleteAllByEspacio(espacio);

            // Elimina espacio
            espaciosRepository.delete(espacio);
        }

        // Elimina relaciones usuarios_espacios
        userEspaciosRepository.deleteAllByUsuario(usuario);

        // Elimina reseteos de contraseña
        resetRepository.deleteByEmail(usuario.getCorreo());

        // Elimina usuario
        repository.delete(usuario);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "Cuenta eliminada exitosamente"), HttpStatus.OK);
    }

}
