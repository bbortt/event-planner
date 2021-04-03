package io.github.bbortt.event.planner.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.domain.Role;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class InvitationDTO {

    @Id
    private Long id;

    @Email
    @NotNull
    @Size(min = 5, max = 254)
    private String email;

    @NotNull
    private Boolean accepted;

    @Size(min = 36, max = 36)
    private String token;

    @Size(min = 4, max = 23)
    private String color;

    @NotNull
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Project project;

    private UserDTO user;

    @NotNull
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Role role;

    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Responsibility responsibility;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }
}
