package mx.edu.utez.gasta2.Service;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Pagos.PagoBean;
import mx.edu.utez.gasta2.Model.Pagos.PagosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
public class PagoService {
    @Autowired
    private PagosRepository repository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idEspacio){
        return new ResponseEntity<>(new ApiResponse(repository.findAllByEspacioId(idEspacio), HttpStatus.OK,"Obteniendo todos los pagos del espacio: " +idEspacio), HttpStatus.OK);
    }
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> getOne(Long idUuario, Long idEspacio){
        return new ResponseEntity<>(new ApiResponse(repository.findAllByUsuarioAndEspacio(idUuario, idEspacio), HttpStatus.OK, "Espacios individuales"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> changeStatus(Long id){
        Optional<PagoBean> findPago = repository.findById(id);

        if(findPago.isPresent()){
            PagoBean p = findPago.get();

           if(p.getEstatus()){
               p.setEstatus(false);
           }
           p.setEstatus(true);
           repository.save(p);
            return new ResponseEntity<>(new ApiResponse( HttpStatus.OK, false, "Estado del pago cambiado"), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse( HttpStatus.NOT_FOUND,true ,"Gasto no encontrado"), HttpStatus.NOT_FOUND);


    }

}
