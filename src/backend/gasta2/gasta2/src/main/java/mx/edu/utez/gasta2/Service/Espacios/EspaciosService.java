package mx.edu.utez.gasta2.Service.Espacios;

import mx.edu.utez.gasta2.Config.ApiResponse;
import mx.edu.utez.gasta2.Model.Espacios.EspacioBean;
import mx.edu.utez.gasta2.Model.Espacios.EspaciosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
public class EspaciosService {

    @Autowired
    private EspaciosRepository repository;


    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(){
        return new ResponseEntity<>(new ApiResponse(repository.findAll(), HttpStatus.OK, "Todos los espacios obtenidos"), HttpStatus.OK);

    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> createSpace(EspacioBean espacioBean){
        Optional<EspacioBean> found = repository.findByNombre(espacioBean.getNombre());

        // Si ya existe espacio con ese nombre, error
        if(found.isPresent()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre de este espacio ya se encuentra registrado"), HttpStatus.BAD_REQUEST);
        }

        // Aquí no usas found.get() porque found NO tiene valor (ya comprobaste que no existe)

        // Validar que nombre no sea vacío o null
        if(espacioBean.getNombre() == null || espacioBean.getNombre().isBlank()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "El nombre del espacio no debe estar vacío"), HttpStatus.BAD_REQUEST);
        }

        String codigo = generarCodigoInvitacionUnico();
        espacioBean.setCodigoinvitacion(codigo);

        return new ResponseEntity<>(new ApiResponse(repository.saveAndFlush(espacioBean),HttpStatus.OK,  "Espacio creado correctamente"), HttpStatus.OK);
    }


    public String generarCodigoInvitacionUnico() {
        String codigo;
        do {
            int numero = (int) (Math.random() * 90000) + 10000;
            codigo = String.valueOf(numero);
            System.out.println(codigo);
        } while (repository.existsByCodigoinvitacion(codigo));
        return codigo;
    }



}
