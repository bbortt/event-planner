package io.github.bbortt.event.planner.web.api.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import io.github.bbortt.event.planner.service.api.dto.Event;
import io.github.bbortt.event.planner.service.api.dto.Location;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ApiProjectEventMapperTest {

    private Event event;
    private EventDTO eventDTO;

    private ApiProjectEventMapper fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ApiProjectEventMapperImpl();

        Location location = new Location().id(2345L).name("location");
        event = new Event().id(1234L).name("event name").location(location);

        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setId(location.getId());
        locationDTO.setName(location.getName());
        locationDTO.setChildren(Collections.emptyList());

        eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setName(event.getName());
        eventDTO.setLocation(locationDTO);
    }

    @Test
    void toApiDTO() {
        Event result = fixture.toApiDTO(eventDTO);

        assertThat(result).isNotNull();
        assertThat(result).usingRecursiveComparison().isEqualTo(event);
    }

    @Test
    void toApiDTOIsNullResistant() {
        assertNull(fixture.toApiDTO(null));
    }
}
