package fic.udc.ecosbot.model.services;

import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;
import fic.udc.ecosbot.model.entities.User;

public interface UserService {
    void signUp(User user) throws DuplicateInstanceException;
}
