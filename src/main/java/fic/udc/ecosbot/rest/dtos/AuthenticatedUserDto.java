package fic.udc.ecosbot.rest.dtos;

public class AuthenticatedUserDto {

    private String serviceToken;
    private UserDto user;

    public AuthenticatedUserDto() {
    }

    public AuthenticatedUserDto(String serviceToken, UserDto user) {
        this.serviceToken = serviceToken;
        this.user = user;
    }

    public String getServiceToken() {
        return serviceToken;
    }

    public void setServiceToken(String serviceToken) {
        this.serviceToken = serviceToken;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
