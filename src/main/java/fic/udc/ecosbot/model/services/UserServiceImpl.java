package fic.udc.ecosbot.model.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;
import fic.udc.ecosbot.model.common.exceptions.IncorrectLoginException;
import fic.udc.ecosbot.model.entities.UserDao;
import fic.udc.ecosbot.model.entities.Users;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void signUp(Users user) throws DuplicateInstanceException {

        if (userDao.existsByUserName(user.getUserName())) {
            throw new DuplicateInstanceException("project.entities.user", user.getUserName());
        }

        if (userDao.existsByEmail(user.getEmail())) {
            throw new DuplicateInstanceException("project.entities.user", user.getEmail());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Users login(String userName, String password) throws IncorrectLoginException {

        Optional<Users> user = userDao.findByUserName(userName);

        if (!user.isPresent()) {
            throw new IncorrectLoginException(userName, password);
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new IncorrectLoginException(userName, password);
        }

        return user.get();

    }
}