package mx.edu.utez.gasta2.Model.Usuarios_Espacios;

import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserEspaciosRepository extends JpaRepository<UsuariosEspaciosBean, Long> {

    Optional<UsuariosEspaciosBean> findFirstByUsuario_Id(Long idusuario);

    boolean existsByUsuarioAndEspacio(UsuarioBean usuario, EspacioBean espacio);

    List<UsuariosEspaciosBean> findAllByEspacio(EspacioBean espacio);


}
