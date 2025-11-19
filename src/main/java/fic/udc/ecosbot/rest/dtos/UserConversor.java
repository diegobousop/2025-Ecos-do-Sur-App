package fic.udc.ecosbot.rest.dtos;
import fic.udc.ecosbot.model.entities.Users;


public class UserConversor {
    private UserConversor() {
	}

    public static final Users toUser(UserRegisterParamsDto userDto) {

		return new Users(
            userDto.getUserName(),
            userDto.getEmail(),
            userDto.getPassword()
        );
	}
}
