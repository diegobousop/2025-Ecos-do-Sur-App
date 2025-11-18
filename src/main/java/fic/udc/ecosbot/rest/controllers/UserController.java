package fic.udc.ecosbot.rest.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import fic.udc.ecosbot.model.services.UserService;

import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;

import fic.udc.ecosbot.rest.dtos.UserRegisterParamsDto;
import fic.udc.ecosbot.rest.dtos.UserConversor;
import fic.udc.ecosbot.model.entities.User;



@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/sign-up")
    public String signUp(@RequestBody UserRegisterParamsDto userDto) throws DuplicateInstanceException {
        User user = UserConversor.toUser(userDto);
        userService.signUp(user);
        return "Hello, I'm working!";
    }
    
}
