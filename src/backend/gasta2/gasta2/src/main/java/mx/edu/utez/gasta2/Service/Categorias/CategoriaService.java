package mx.edu.utez.gasta2.Service.Categorias;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaBean;
import mx.edu.utez.gasta2.Model.Categorias.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLClientInfoException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAllByID(Long Espacioid){
        List<CategoriaBean> categorias = repository.findAllByEspacio_Id(Espacioid);

        return new ResponseEntity<>(new ApiResponse(categorias, HttpStatus.OK, "Categorias pertenecientes al ID " +Espacioid), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLClientInfoException.class})
    public ResponseEntity<ApiResponse> saveCategory(CategoriaBean categoriaBean){
        Optional<CategoriaBean> foundCategory = repository.findByNombreAndEspacio_Id(
                categoriaBean.getNombre(),
                categoriaBean.getEspacio().getId()
        );

        if (foundCategory.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "La categoría ya se encuentra registrada en este espacio"), HttpStatus.BAD_REQUEST);
        }

        if (categoriaBean.getNombre() == null || categoriaBean.getNombre().isBlank()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre de la categoría no debe estar vacío"), HttpStatus.BAD_REQUEST);
        }

        // Aquí usas el bean directamente
        repository.saveAndFlush(categoriaBean);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.CREATED, false, "La categoría ha sido registrada en el espacio"), HttpStatus.CREATED);
    }

    public void defaultCategory(List<CategoriaBean> categoriaBeans){
        for (CategoriaBean cat : categoriaBeans) {
            repository.save(cat);
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<ApiResponse> updateCategory(Long id, CategoriaBean nuevaCategoria) {
        Optional<CategoriaBean> optional = repository.findById(id);

        if (optional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Categoría no encontrada"), HttpStatus.NOT_FOUND);
        }

        CategoriaBean actual = optional.get();

        //   Si hay nombre duplicado dentro del mismo espacio
        Optional<CategoriaBean> exists = repository.findByNombreAndEspacio_Id(nuevaCategoria.getNombre(), nuevaCategoria.getEspacio().getId());
        if (exists.isPresent() && !exists.get().getId().equals(id)) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Ya existe una categoría con ese nombre en este espacio"), HttpStatus.BAD_REQUEST);
        }

        actual.setNombre(nuevaCategoria.getNombre());
        actual.setEspacio(nuevaCategoria.getEspacio());

        repository.saveAndFlush(actual);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, true, "Categoría actualizada correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<ApiResponse> deleteCategory(Long id) {
        Optional<CategoriaBean> optional = repository.findById(id);

        if (optional.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Categoría no encontrada"), HttpStatus.NOT_FOUND);
        }

        repository.deleteById(id);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, true, "Categoría eliminada correctamente"), HttpStatus.OK);
    }



}
