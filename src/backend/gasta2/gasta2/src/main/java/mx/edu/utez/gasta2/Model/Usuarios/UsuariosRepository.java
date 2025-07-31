package mx.edu.utez.gasta2.Model.Usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuarioBean, Long> {

    Optional<UsuarioBean>findByNombreusuario(String nombreusuario);

    Optional<UsuarioBean>findByCorreo(String correo);

    @Query("SELECT ue.usuario, ue.porcentajeGasto FROM UsuariosEspaciosBean ue WHERE ue.espacio.id = :idEspacio")
    List<Object[]>findUsuariosConPorcentajeByEspacioId(@Param("idEspacio") Long idEspacio);

}
