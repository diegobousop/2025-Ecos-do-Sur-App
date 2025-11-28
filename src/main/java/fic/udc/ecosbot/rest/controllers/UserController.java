package fic.udc.ecosbot.rest.controllers;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fic.udc.ecosbot.model.common.exceptions.DuplicateInstanceException;
import fic.udc.ecosbot.model.common.exceptions.IncorrectLoginException;
import fic.udc.ecosbot.model.entities.Users;
import fic.udc.ecosbot.model.services.UserService;
import fic.udc.ecosbot.rest.common.ErrorsDto;
import fic.udc.ecosbot.rest.common.JwtGenerator;
import fic.udc.ecosbot.rest.common.JwtInfo;
import fic.udc.ecosbot.rest.dtos.AuthenticatedUserDto;
import fic.udc.ecosbot.rest.dtos.LoginParamsDto;
import fic.udc.ecosbot.rest.dtos.UserConversor;
import fic.udc.ecosbot.rest.dtos.UserRegisterParamsDto;
import org.springframework.context.MessageSource;

@RestController
@RequestMapping("/api/user")
public class UserController {

    /** The Constant INCORRECT_LOGIN_EXCEPTION_CODE. */
	private static final String INCORRECT_LOGIN_EXCEPTION_CODE = "project.exceptions.IncorrectLoginException";

    @Autowired
    UserService userService;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private MessageSource messageSource;

    @ExceptionHandler(IncorrectLoginException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ErrorsDto handleIncorrectLoginException(IncorrectLoginException exception, Locale locale) {

		String errorMessage = messageSource.getMessage(INCORRECT_LOGIN_EXCEPTION_CODE, null,
				INCORRECT_LOGIN_EXCEPTION_CODE, locale);

		return new ErrorsDto(errorMessage);

	}

    @PostMapping("/sign-up")
    public String signUp(@RequestBody UserRegisterParamsDto userDto) throws DuplicateInstanceException {
        Users user = UserConversor.toUser(userDto);
        userService.signUp(user);
        return "Hello, I'm working!";
    }

    @PostMapping("/login")
    public AuthenticatedUserDto login(@RequestBody LoginParamsDto params) throws IncorrectLoginException {

        Users user = userService.login(params.getUserName(), params.getPassword());

        return UserConversor.toAuthenticatedUserDto(
                jwtGenerator.generate(new JwtInfo(user.getId(), user.getUserName(), user.getRole().toString())),
                user);

    }

}
