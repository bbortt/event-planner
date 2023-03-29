package io.github.bbortt.event.planner.web.api.mapper;

import io.github.bbortt.event.planner.service.api.dto.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiProjectMapper {
    TimeUtils timeUtils = new TimeUtils(ZoneId::systemDefault);

    Project toApiDTO(ProjectDTO entity);

    default LocalDate map(Instant instant) {
        return timeUtils.toLocalDate(instant);
    }
}
