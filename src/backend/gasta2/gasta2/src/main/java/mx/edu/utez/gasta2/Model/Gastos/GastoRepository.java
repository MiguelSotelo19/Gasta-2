package mx.edu.utez.gasta2.Model.Gastos;

import mx.edu.utez.gasta2.Model.Categorias.CategoriaBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<GastoBean, Long> {
//    void deleteByUsuarioId(Long idUsuario);

   //List<GastoBean> findAllByTipogasto_Espacio_Id(Long idEspacio);

    
}
