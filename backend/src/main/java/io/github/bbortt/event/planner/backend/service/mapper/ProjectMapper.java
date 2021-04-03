package io.github.bbortt.event.planner.backend.service.mapper;

import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Project} and its DTO called {@link CreateProjectDTO}.
 */
@Component
public class ProjectMapper {

    public Project projectFromCreateProjectDTO(CreateProjectDTO createProjectDTO) {
        if (createProjectDTO == null) {
            return null;
        } else {
            return new Project()
                .name(createProjectDTO.getName())
                .description(createProjectDTO.getDescription())
                .startTime(createProjectDTO.getStartTime())
                .endTime(createProjectDTO.getEndTime());
        }
    }
}
