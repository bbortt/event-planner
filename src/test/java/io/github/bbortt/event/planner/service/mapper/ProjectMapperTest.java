package io.github.bbortt.event.planner.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProjectMapperTest {

    private Project project;
    private ProjectDTO projectDTO;

    private ProjectMapper fixture;

    @BeforeEach
    void setUp() {
        fixture = new ProjectMapperImpl();

        project =
            new Project()
                .token(UUID.fromString("11f46a3a-a360-4841-9c37-8040db5b506c"))
                .name("project name")
                .description("a test description")
                .startDate(Instant.now())
                .endDate(Instant.now())
                .archived(false)
                .createdBy("wade wilson")
                .createdDate(Instant.now());

        projectDTO = fixture.toDto(project);
    }

    @Test
    void toDto() {
        List<Project> projects = new ArrayList<>();
        projects.add(project);
        projects.add(null);

        List<ProjectDTO> projectDTOS = fixture.toDto(projects);

        assertThat(projectDTOS).isNotEmpty().size().isEqualTo(2);
        assertThat(projectDTOS.get(0)).usingRecursiveComparison().isEqualTo(projectDTO);
        assertThat(projectDTOS.get(1)).isNull();
    }

    @Test
    void toEntity() {
        List<ProjectDTO> projectsDto = new ArrayList<>();
        projectsDto.add(projectDTO);
        projectsDto.add(null);

        List<Project> projects = fixture.toEntity(projectsDto);

        assertThat(projects).isNotEmpty().size().isEqualTo(2);
        assertThat(projects.get(0)).usingRecursiveComparison().isEqualTo(project);
        assertThat(projects.get(1)).isNull();
    }
}
