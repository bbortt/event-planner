package io.github.bbortt.event.planner.service.mapper;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.CreateProjectDTO;

/**
 * Mapper for the entity {@link Project} and its DTO called {@link CreateProjectDTO}.
 */
public class ProjectMapper {

    public Project createProjectDTOToProject(CreateProjectDTO createProjectDTO) {
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
