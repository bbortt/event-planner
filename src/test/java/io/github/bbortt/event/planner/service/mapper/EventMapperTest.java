package io.github.bbortt.event.planner.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EventMapperTest {

    private static final String LOCATION_NAME = "test location name";

    private Event event;
    private EventDTO eventDTO;

    private EventMapper fixture;

    @BeforeEach
    public void setUp() {
        fixture = new EventMapperImpl();

        event = new Event().name("event name").location(new Location().name(LOCATION_NAME));

        eventDTO = fixture.toDto(event);
    }

    @Test
    void toDto() {
        EventDTO result = fixture.toDto(event);

        assertThat(result).usingRecursiveComparison().ignoringFields("location").isEqualTo(eventDTO);
        assertThat(result.getLocation().getName()).isEqualTo(LOCATION_NAME);
    }

    @Test
    void toEntity() {
        Event result = fixture.toEntity(eventDTO);

        assertThat(result).usingRecursiveComparison().ignoringFields("location").isEqualTo(event);
        assertThat(result.getLocation().getName()).isEqualTo(LOCATION_NAME);
    }
}
