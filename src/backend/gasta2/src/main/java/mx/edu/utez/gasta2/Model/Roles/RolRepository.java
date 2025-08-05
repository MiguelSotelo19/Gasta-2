package mx.edu.utez.gasta2.Model.Roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<RolBean, Long> {
    boolean existsByRol(String rol);


}
