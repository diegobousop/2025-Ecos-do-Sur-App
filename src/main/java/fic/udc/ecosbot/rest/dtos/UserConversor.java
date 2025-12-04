package fic.udc.ecosbot.rest.dtos;

import fic.udc.ecosbot.model.entities.Users;

public class UserConversor {
    public static final Users toUser(UserRegisterParamsDto userDto) {

        return new Users(
                userDto.getUserName(),
                userDto.getEmail(),
                userDto.getPassword(),
                Users.RoleType.USER);
    }

    public static final UserDto toUserDto(Users user) {
        return new UserDto(user.getId(), user.getUserName(), user.getEmail(), user.getRole().toString());
    }

    public static final AuthenticatedUserDto toAuthenticatedUserDto(String serviceToken, Users user) {
        return new AuthenticatedUserDto(serviceToken, toUserDto(user));
    }

    private UserConversor() {
    }
}
