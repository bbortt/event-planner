package io.github.bbortt.event.planner.web.api.mapper;

import static org.mapstruct.factory.Mappers.getMapper;

import io.github.bbortt.event.planner.service.api.dto.Event;
import io.github.bbortt.event.planner.service.api.dto.Location;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiProjectEventMapper {
    ApiProjectLocationMapper API_PROJECT_LOCATION_MAPPER = getMapper(ApiProjectLocationMapper.class);

    TimeUtils timeUtils = new TimeUtils();

    Event toApiDTO(EventDTO entity);

    default OffsetDateTime map(Instant instant) {
        return timeUtils.toOffsetDateTime(instant);
    }

    default Optional<Location> map(LocationDTO value) {
        return Optional.ofNullable(API_PROJECT_LOCATION_MAPPER.toApiDTO(value));
    }
}
