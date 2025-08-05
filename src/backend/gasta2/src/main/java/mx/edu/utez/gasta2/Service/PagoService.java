package mx.edu.utez.gasta2.Service;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Pagos.DTO.PagoDTO;
import mx.edu.utez.gasta2.Model.Pagos.PagoBean;
import mx.edu.utez.gasta2.Model.Pagos.PagosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PagoService {

    @Autowired
    private PagosRepository repository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idEspacio) {
        List<PagoBean> pagos = repository.findAllByEspacioId(idEspacio);
        List<PagoDTO> dtos = pagos.stream().map(PagoDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(new ApiResponse(dtos, HttpStatus.OK, "Obteniendo todos los pagos del espacio: " + idEspacio), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getOne(Long idUsuario, Long idEspacio) {
        List<PagoBean> pagos = repository.findAllByUsuarioAndEspacio(idUsuario, idEspacio);
        List<PagoDTO> dtos = pagos.stream().map(PagoDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(new ApiResponse(dtos, HttpStatus.OK, "Pagos individuales del usuario: " + idUsuario), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> changeStatus(Long id) {
        Optional<PagoBean> findPago = repository.findById(id);

        if (findPago.isPresent()) {
            PagoBean p = findPago.get();

            if (Boolean.TRUE.equals(p.getEstatus())) {
                return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El pago ya está en estatus 'true'"), HttpStatus.BAD_REQUEST);
            }

            p.setEstatus(true);
            repository.save(p);

            return new ResponseEntity<>(new ApiResponse(new PagoDTO(p), HttpStatus.OK, "Estado del pago cambiado"), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "Pago no encontrado"), HttpStatus.NOT_FOUND);
    }
}