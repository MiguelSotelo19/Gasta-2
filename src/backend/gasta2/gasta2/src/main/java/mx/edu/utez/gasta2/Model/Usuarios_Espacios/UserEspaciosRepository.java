package mx.edu.utez.gasta2.Model.Usuarios_Espacios;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserEspaciosRepository extends JpaRepository<UsuariosEspaciosBean, Long> {

    Optional<UsuariosEspaciosBean> findFirstByUsuario_Id(Long idusuario);
}
