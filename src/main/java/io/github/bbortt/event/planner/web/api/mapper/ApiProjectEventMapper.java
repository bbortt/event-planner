package io.github.bbortt.event.planner.web.api.mapper;

import io.github.bbortt.event.planner.service.api.dto.Event;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import java.time.Instant;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiProjectEventMapper {
    TimeUtils timeUtils = new TimeUtils();

    Event toApiDTO(EventDTO entity);

    default OffsetDateTime map(Instant instant) {
        return timeUtils.toOffsetDateTime(instant);
    }
}
