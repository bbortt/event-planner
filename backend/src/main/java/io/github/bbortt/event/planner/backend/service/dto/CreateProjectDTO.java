package io.github.bbortt.event.planner.backend.service.dto;

import java.time.ZonedDateTime;
import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateProjectDTO {

    @NotEmpty
    @Size(min = 1, max = 50)
    private String name;

    @Size(max = 300)
    private String description;

    @NotNull
    private ZonedDateTime startTime;

    @NotNull
    private ZonedDateTime endTime;

    private AdminUserDTO userInformation;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public AdminUserDTO getUserInformation() {
        return userInformation;
    }

    public void setUserInformation(AdminUserDTO userInformationDTO) {
        this.userInformation = userInformationDTO;
    }
}
