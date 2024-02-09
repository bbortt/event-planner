package io.github.bbortt.event.planner.web.api.mapper;

import io.github.bbortt.event.planner.service.api.dto.Location;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiProjectLocationMapper extends MapperWithOptionals {
    Location toApiDTO(LocationDTO entity);
}
