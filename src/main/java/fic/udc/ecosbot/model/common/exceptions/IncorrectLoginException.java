package fic.udc.ecosbot.model.common.exceptions;

@SuppressWarnings("serial")
public class IncorrectLoginException extends Exception {

    private String userName;
    private String password;

    public IncorrectLoginException(String userName, String password) {
        super("Incorrect login for user " + userName);
        this.userName = userName;
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

}
