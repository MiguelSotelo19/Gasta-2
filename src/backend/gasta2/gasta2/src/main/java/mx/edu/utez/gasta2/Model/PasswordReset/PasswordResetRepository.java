package mx.edu.utez.gasta2.Model.PasswordReset;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByEmailAndCodeAndUsedFalse(String email, String code);
    Optional<PasswordReset>findTopByEmailOrderByExpirationDesc(String email);

    List<PasswordReset> findAllByEmailAndUsedFalse(String email);

}
