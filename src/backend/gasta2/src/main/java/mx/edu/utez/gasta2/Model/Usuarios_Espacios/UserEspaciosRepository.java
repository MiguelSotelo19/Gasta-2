package mx.edu.utez.gasta2.Model.Usuarios_Espacios;

import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Usuarios.UsuarioBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserEspaciosRepository extends JpaRepository<UsuariosEspaciosBean, Long> {

    Optional<UsuariosEspaciosBean> findFirstByUsuario_Id(Long idusuario);

    boolean existsByUsuarioAndEspacio(UsuarioBean usuario, EspacioBean espacio);

    List<UsuariosEspaciosBean> findAllByEspacio(EspacioBean espacio);

    Optional<UsuariosEspaciosBean> findByUsuarioAndEspacio(UsuarioBean usuario, EspacioBean espacio);

    Optional<UsuariosEspaciosBean> findByUsuarioIdAndEspacioId(Long idUsuario, Long idEspacio);

    Optional<UsuariosEspaciosBean> findByUsuarioAndEspacioIsNull(UsuarioBean usuario);

    void deleteAllByUsuario(UsuarioBean usuario);

    void deleteAllByEspacio(EspacioBean espacio);

    List<UsuariosEspaciosBean> findAllByUsuarioAndRolRol(UsuarioBean usuario, String rol);

    List<UsuariosEspaciosBean> findAllByUsuario_Id(Long idUsuario);

    boolean existsByUsuario_IdAndEspacio_Id(Long usuarioId, Long espacioId);

    boolean existsByUsuario_IdAndEspacio_IdAndRol_Rol(Long idUsuario, Long idEspacio, String Rol);
    @Query("SELECT ue.usuario, ue.porcentajeGasto FROM UsuariosEspaciosBean ue WHERE ue.espacio.id = :idEspacio")
    List<Object[]>findUsuariosConPorcentajeByEspacioId(@Param("idEspacio") Long idEspacio);

    @Query("SELECT ue.usuario FROM UsuariosEspaciosBean ue WHERE ue.espacio.id = :idEspacio")
    List<UsuarioBean> findUsuariosByEspacioId(@Param("idEspacio") Long idEspacio);

    List<UsuariosEspaciosBean> findAllByUsuarioAndEspacioIsNull(UsuarioBean usuario);

}
