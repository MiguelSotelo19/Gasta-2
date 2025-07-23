package mx.edu.utez.gasta2.Model.Categorias;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaBean, Long> {
    void deleteByEspacioId(Long idEspacio);
}
