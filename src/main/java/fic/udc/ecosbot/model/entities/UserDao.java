package fic.udc.ecosbot.model.entities;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<Users, Long>{

    boolean existsByUserName(String userName);

	boolean existsByEmail(String email);
    
	Optional<Users> findByUserName(String userName);
}
