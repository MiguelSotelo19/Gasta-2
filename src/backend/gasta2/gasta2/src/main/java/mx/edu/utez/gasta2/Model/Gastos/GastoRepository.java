package mx.edu.utez.gasta2.Model.Gastos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GastoRepository extends JpaRepository<GastoBean, Long> {
    void deleteByUsuarioId(Long idUsuario);
}
