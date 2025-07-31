package mx.edu.utez.gasta2.Service;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Pagos.PagosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;

@Service
@Transactional
public class PagoService {
    @Autowired
    private PagosRepository repository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idEspacio){
        return new ResponseEntity<>(new ApiResponse(repository.findAllByEspacioId(idEspacio), HttpStatus.OK,"Obteniendo todos los pagos del espacio: " +idEspacio), HttpStatus.OK);
    }
    

}
