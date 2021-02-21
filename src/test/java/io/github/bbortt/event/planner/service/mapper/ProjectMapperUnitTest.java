package io.github.bbortt.event.planner.service.mapper;

import io.github.bbortt.event.planner.service.dto.CreateProjectDTO;
import java.time.ZonedDateTime;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;

class ProjectMapperUnitTest {

    ProjectMapper fixture;

    @BeforeEach
    public void beforeEachSetup() {
        fixture = new ProjectMapper();
    }

    @Test
    void createProjectDTOToProjectReturnsNullOnNullInput() {
        Assertions.assertThat(fixture.createProjectDTOToProject(null)).isNull();
    }

    @Test
    void createProjectDTOToProjectDoesReturnProject() {
        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setName("name");
        createProjectDTO.setDescription("description");
        createProjectDTO.setStartTime(ZonedDateTime.now());
        createProjectDTO.setEndTime(ZonedDateTime.now());

        Assertions.assertThat(fixture.createProjectDTOToProject(createProjectDTO))
            .hasFieldOrPropertyWithValue("name", createProjectDTO.getName())
            .hasFieldOrPropertyWithValue("description", createProjectDTO.getDescription())
            .hasFieldOrPropertyWithValue("startTime", createProjectDTO.getStartTime())
            .hasFieldOrPropertyWithValue("endTime", createProjectDTO.getEndTime());
    }
}
