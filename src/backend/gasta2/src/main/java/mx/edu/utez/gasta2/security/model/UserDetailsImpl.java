package mx.edu.utez.gasta2.security.model;

import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import mx.edu.utez.gasta2.Model.Usuarios_Espacios.UsuariosEspaciosBean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;

public class UserDetailsImpl implements UserDetails{
    private String username;
    private String password;
    private boolean enabled;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(String username, String password, boolean enabled, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.authorities = authorities;
    }

    public UserDetailsImpl(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(UsuariosEspaciosBean user){
        Set<GrantedAuthority> authorities =
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRol().getRol()));
        return new UserDetailsImpl(
                user.getUsuario().getCorreo(),
                user.getUsuario().getContrasenia(),
                user.getUsuario().getStatus(),
                authorities
        );
    }



    //    public static UserDetailsImpl build(PersonaBean user) {
//        // Obtenemos el rol del usuario
//        RolBean rol = user.getRolBean();
//
//        // Creamos una autoridad utilizando el nombre del rol
//        GrantedAuthority authority = new SimpleGrantedAuthority(rol.getRol());
//
//        // Creamos un conjunto de autoridades con el rol del usuario
//        Set<GrantedAuthority> authorities = Collections.singleton(authority);
//
//        // Construimos y retornamos un objeto UserDetailsImpl con los datos del usuario
//        return new UserDetailsImpl(
//                user.getNombreUsuario(),
//                user.getContrasenia(),
//                user.getEstatus(),
//                authorities
//        );
//    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
