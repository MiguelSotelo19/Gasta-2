package mx.edu.utez.gasta2.Model.Espacios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EspaciosRepository extends JpaRepository<EspacioBean, Long> {
   Optional<EspacioBean>findByNombre(String nombre);
   boolean existsByCodigoinvitacion(String codigo);

   Optional<EspacioBean> findByCodigoinvitacion(String codigo);


}
