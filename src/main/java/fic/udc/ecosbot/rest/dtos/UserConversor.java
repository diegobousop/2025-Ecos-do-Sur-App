package fic.udc.ecosbot.rest.dtos;

import fic.udc.ecosbot.model.entities.User;
import fic.udc.ecosbot.rest.dtos.UserRegisterParamsDto;


public class UserConversor {
    private UserConversor() {
	}



    public static final User toUser(UserRegisterParamsDto userDto) {

		return new User(
            userDto.getUserName(),
            userDto.getEmail()
        );
	}
}
