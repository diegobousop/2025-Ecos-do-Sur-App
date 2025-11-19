package fic.udc.ecosbot.model.services;

import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;
import fic.udc.ecosbot.model.entities.Users;

public interface UserService {
    void signUp(Users user) throws DuplicateInstanceException;
}
