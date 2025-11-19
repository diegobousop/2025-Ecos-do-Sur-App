package fic.udc.ecosbot.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;
import fic.udc.ecosbot.model.entities.Users;
import fic.udc.ecosbot.model.services.UserService;
import fic.udc.ecosbot.rest.dtos.UserConversor;
import fic.udc.ecosbot.rest.dtos.UserRegisterParamsDto;



@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/sign-up")
    public String signUp(@RequestBody UserRegisterParamsDto userDto) throws DuplicateInstanceException {
        Users user = UserConversor.toUser(userDto);
        userService.signUp(user);
        return "Hello, I'm working!";
    }
    
}
