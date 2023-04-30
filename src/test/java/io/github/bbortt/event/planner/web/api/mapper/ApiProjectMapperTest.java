package io.github.bbortt.event.planner.web.api.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import io.github.bbortt.event.planner.service.api.dto.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ApiProjectMapperTest {

    private Project project;
    private ProjectDTO projectDTO;

    private ApiProjectMapper fixture;

    @BeforeEach
    void setUp() {
        fixture = new ApiProjectMapperImpl();

        project =
            new Project()
                .id(1234L)
                .name("project name")
                .description("a test description")
                .token("a47ef93f-b628-4505-9dde-13cdfccc0c64")
                .startDate(LocalDate.parse("2023-03-29"))
                .endDate(LocalDate.parse("2023-03-30"));

        projectDTO = new ProjectDTO();
        projectDTO.setId(project.getId());
        projectDTO.setToken(UUID.fromString(project.getToken()));
        projectDTO.setName(project.getName());
        projectDTO.setDescription(project.getDescription());
        projectDTO.setStartDate(Instant.parse("2023-03-29T00:00:00.00Z"));
        projectDTO.setEndDate(Instant.parse("2023-03-30T00:00:00.00Z"));
        projectDTO.setArchived(false);
        projectDTO.setCreatedBy("Cassandra Eleanore Lang");
        projectDTO.setCreatedDate(Instant.now());
        projectDTO.setLastModifiedBy("Nicholas Joseph \"Nick\" Fury");
        projectDTO.setLastModifiedDate(Instant.now());
    }

    @Test
    void toApiDTO() {
        Project result = fixture.toApiDTO(projectDTO);

        assertThat(result).isNotNull();
        assertThat(result).usingRecursiveComparison().isEqualTo(project);
    }

    @Test
    void toApiDTOIsNullResistant() {
        assertNull(fixture.toApiDTO(null));
    }
}
