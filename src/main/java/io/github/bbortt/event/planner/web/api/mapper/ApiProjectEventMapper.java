package io.github.bbortt.event.planner.web.api.mapper;

import io.github.bbortt.event.planner.service.api.dto.Event;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiProjectEventMapper {
    Event toApiDTO(EventDTO entity);
}
