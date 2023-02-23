package io.github.bbortt.event.planner.service.mapper;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Project} and its DTO {@link ProjectDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProjectMapper extends EntityMapper<ProjectDTO, Project> {}
