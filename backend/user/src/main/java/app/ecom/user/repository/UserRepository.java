package app.ecom.user.repository;

import app.ecom.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    // 🔍 Admin features
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    Page<User> findByRole(String role, Pageable pageable);

    Page<User> findByEnabled(boolean enabled, Pageable pageable);
}