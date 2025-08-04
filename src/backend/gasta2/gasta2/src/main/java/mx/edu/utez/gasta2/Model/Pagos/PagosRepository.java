package mx.edu.utez.gasta2.Model.Pagos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PagosRepository extends JpaRepository<PagoBean, Long> {
    void deleteAllByUsuarioId(Long idUsuario);

    @Query("""
    SELECT p FROM PagoBean p
    WHERE p.gasto.tipogasto.espacio.id = :idEspacio
""")
    List<PagoBean> findAllByEspacioId(@Param("idEspacio") Long idEspacio);


    @Query("""
    SELECT p FROM PagoBean p
    WHERE p.usuario.id = :idUsuario
    AND p.gasto.tipogasto.espacio.id = :idEspacio
""")
    List<PagoBean> findAllByUsuarioAndEspacio(@Param("idUsuario") Long idUsuario,
                                              @Param("idEspacio") Long idEspacio);
    @Query("SELECT p FROM PagoBean p WHERE p.gasto.id = :gastoId")
    List<PagoBean> findByGasto_Id(@Param("gastoId") Long gastoId);
}
