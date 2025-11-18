package fic.udc.ecosbot.model.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;
import fic.udc.ecosbot.model.entities.User;
import fic.udc.ecosbot.model.entities.UserDao;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
	private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void signUp(User user) throws DuplicateInstanceException {
        
        if (userDao.existsByUserName(user.getUserName())) {
			throw new DuplicateInstanceException("project.entities.user", user.getUserName());
		}

		if (userDao.existsByEmail(user.getEmail())) {
			throw new DuplicateInstanceException("project.entities.user", user.getEmail());
		}


		user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.save(user);
    }
}
                                                                                               