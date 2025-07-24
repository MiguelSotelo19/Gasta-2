package mx.edu.utez.gasta2.Model.Categorias;

import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaBean, Long> {
    Optional<CategoriaBean>findByNombreAndEspacio_Id(String nombre, Long EspacioId);

    List<CategoriaBean>findAllByEspacio_Id(Long id);
}
