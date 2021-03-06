package io.github.bbortt.event.planner.backend.service.mapper;

import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import java.time.ZonedDateTime;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProjectMapperUnitTest {

    ProjectMapper fixture;

    @BeforeEach
    public void beforeEachSetup() {
        fixture = new ProjectMapper();
    }

    @Test
    void projectFromCreateProjectDTOReturnsNullOnNullInput() {
        Assertions.assertThat(fixture.projectFromCreateProjectDTO(null)).isNull();
    }

    @Test
    void projectFromCreateProjectDTODoesReturnProject() {
        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setName("name");
        createProjectDTO.setDescription("description");
        createProjectDTO.setStartTime(ZonedDateTime.now());
        createProjectDTO.setEndTime(ZonedDateTime.now());

        Assertions
            .assertThat(fixture.projectFromCreateProjectDTO(createProjectDTO))
            .hasFieldOrPropertyWithValue("name", createProjectDTO.getName())
            .hasFieldOrPropertyWithValue("description", createProjectDTO.getDescription())
            .hasFieldOrPropertyWithValue("startTime", createProjectDTO.getStartTime())
            .hasFieldOrPropertyWithValue("endTime", createProjectDTO.getEndTime());
    }
}
