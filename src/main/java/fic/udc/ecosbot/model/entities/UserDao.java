package fic.udc.ecosbot.model.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserDao extends JpaRepository<User, Long>{

    boolean existsByUserName(String userName);

	boolean existsByEmail(String email);
    
	Optional<User> findByUserName(String userName);
}
