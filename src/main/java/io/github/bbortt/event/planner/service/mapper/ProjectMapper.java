package io.github.bbortt.event.planner.service.mapper;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for the entity {@link Project} and its DTO {@link ProjectDTO}.
 */
@Mapper(componentModel = "spring", uses = { MemberMapper.class })
public interface ProjectMapper extends EntityMapper<ProjectDTO, Project> {
    @Mapping(target = "members", ignore = true)
    Project toEntity(ProjectDTO project);

    @Named("partialUpdate")
    @Mapping(target = "members", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget Project entity, ProjectDTO dto);
}
