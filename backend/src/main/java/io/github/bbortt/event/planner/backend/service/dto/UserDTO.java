package io.github.bbortt.event.planner.backend.service.dto;

/**
 * A DTO representing a user, with only the public attributes.
 */
public class UserDTO {

    private String id;
    private String login;
    private String email;

    public UserDTO() {
        // Empty constructor needed for Jackson.
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserDTO{" +
            "id='" + id + '\'' +
            ", login='" + login + '\'' +
            ", email='" + email + '\'' +
            "}";
    }
}
