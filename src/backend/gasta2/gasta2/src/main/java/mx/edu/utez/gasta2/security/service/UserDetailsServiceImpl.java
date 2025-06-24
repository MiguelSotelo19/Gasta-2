package mx.edu.utez.gasta2.security.service;


import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuariosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UserEspaciosRepository;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;
import mx.edu.utez.gasta2.security.model.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private UserEspaciosRepository usuariosEspaciosRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        UsuarioBean usuario = usuariosRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // ⚠️ Elegimos por defecto el primer espacio relacionado
        UsuariosEspaciosBean relacion = usuariosEspaciosRepository.findFirstByUsuario_Id(usuario.getId())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no tiene relación con ningún espacio"));

        return UserDetailsImpl.build(relacion);
    }
}

