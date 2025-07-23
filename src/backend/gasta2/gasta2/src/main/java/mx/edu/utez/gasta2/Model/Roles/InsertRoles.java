package mx.edu.utez.gasta2.Model.Roles;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InsertRoles {

    @Autowired
    private RolRepository rolRepository;


    @PostConstruct
    public void init() {
        if (!rolRepository.existsByRol("Administrador")) {
            rolRepository.save(new RolBean("Administrador"));
        }

        System.out.println("Si existe el de admin");

        if (!rolRepository.existsByRol("Invitado")) {
            rolRepository.save(new RolBean("Invitado"));
        }

        System.out.println("Si existe el de invitado");
    }
}
