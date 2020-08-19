package io.github.bbortt.event.planner.service.dto;

import java.time.ZonedDateTime;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A DTO representing a new project with required information.
 */
public class CreateProjectDTO {
    @NotEmpty
    @Size(max = 50)
    private String name;

    @Size(max = 300)
    private String description;

    @NotNull
    private ZonedDateTime startTime;

    @NotNull
    private ZonedDateTime endTime;

    @Size(max = 254)
    private String emailOrLogin;
}
