package io.github.bbortt.event.planner.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LocationMapperTest {

    private static final String EVENT_NAME = "test event name";
    private static final String PROJECT_NAME = "test project name";
    private static final String SECOND_LOCATION_NAME = "parent location name";

    private Location location;
    private LocationDTO locationDTO;

    private LocationMapper fixture;

    @BeforeEach
    void setUp() {
        fixture = new LocationMapperImpl();

        location =
            new Location()
                .name("location name")
                .description("a test description")
                .project(new Project().name(PROJECT_NAME))
                .withEvent(new Event().name(EVENT_NAME))
                .createdBy("t'challa")
                .createdDate(Instant.now());

        locationDTO = fixture.toDto(location);
    }

    @Test
    void toDto() {
        List<Location> locations = getLocations();

        List<LocationDTO> locationDTOS = fixture.toDto(locations);

        assertThat(locationDTOS).isNotEmpty().size().isEqualTo(2);
        assertThat(locationDTOS.get(0)).usingRecursiveComparison().ignoringFields("events", "project").isEqualTo(locationDTO);
        assertThat(locationDTOS.get(0)).hasFieldOrPropertyWithValue("project.name", PROJECT_NAME);
        assertThat(locationDTOS.get(0).getEvents()).hasSize(1);
        assertThat(locationDTOS.get(0).getEvents().get(0)).hasFieldOrPropertyWithValue("name", EVENT_NAME);
        assertThat(locationDTOS.get(1)).isNull();
    }

    @Test
    void toEntity() {
        List<LocationDTO> locationDTOs = getLocationDTOS();

        List<Location> locations = fixture.toEntity(locationDTOs);

        assertThat(locations).isNotEmpty().size().isEqualTo(2);
        assertThat(locations.get(0)).usingRecursiveComparison().ignoringFields("events", "project").isEqualTo(location);
        assertThat(locations.get(0)).hasFieldOrPropertyWithValue("project.name", PROJECT_NAME);
        assertThat(locations.get(0).getEvents()).hasSize(1);
        assertThat(locations.get(0).getEvents().iterator().next()).hasFieldOrPropertyWithValue("name", EVENT_NAME);
        assertThat(locations.get(1)).isNull();
    }

    @Test
    void toDtoWithParent() {
        new Location().name(SECOND_LOCATION_NAME).withChild(location);

        List<Location> locations = getLocations();

        List<LocationDTO> locationDTOS = fixture.toDto(locations);

        assertThat(locationDTOS).isNotEmpty().size().isEqualTo(2);
        assertThat(locationDTOS.get(0)).usingRecursiveComparison().ignoringFields("events", "parent", "project").isEqualTo(locationDTO);
        assertThat(locationDTOS.get(0))
            .hasFieldOrPropertyWithValue("project.name", PROJECT_NAME)
            .hasFieldOrPropertyWithValue("parent.name", SECOND_LOCATION_NAME);
        assertThat(locationDTOS.get(0).getEvents()).hasSize(1);
        assertThat(locationDTOS.get(0).getEvents().get(0)).hasFieldOrPropertyWithValue("name", EVENT_NAME);
        assertThat(locationDTOS.get(1)).isNull();
    }

    @Test
    void toDtoWithChild() {
        location.withChild(new Location().name(SECOND_LOCATION_NAME));

        List<Location> locations = getLocations();

        List<LocationDTO> locationDTOS = fixture.toDto(locations);

        assertThat(locationDTOS).isNotEmpty().size().isEqualTo(2);
        assertThat(locationDTOS.get(0)).usingRecursiveComparison().ignoringFields("events", "children", "project").isEqualTo(locationDTO);
        assertThat(locationDTOS.get(0)).hasFieldOrPropertyWithValue("project.name", PROJECT_NAME);
        assertThat(locationDTOS.get(0).getChildren()).isNotEmpty().size().isEqualTo(1);
        assertThat(locationDTOS.get(0).getChildren().iterator().next()).hasFieldOrPropertyWithValue("name", SECOND_LOCATION_NAME);
        assertThat(locations.get(0).getEvents()).hasSize(1);
        assertThat(locations.get(0).getEvents().iterator().next()).hasFieldOrPropertyWithValue("name", EVENT_NAME);
        assertThat(locationDTOS.get(1)).isNull();
    }

    @Test
    void toEntityWithParent() {
        LocationDTO parent = new LocationDTO();
        parent.setName(SECOND_LOCATION_NAME);
        locationDTO.setParent(parent);

        List<LocationDTO> locationDTOs = getLocationDTOS();

        List<Location> locations = fixture.toEntity(locationDTOs);

        assertThat(locations).isNotEmpty().size().isEqualTo(2);
        assertThat(locations.get(0)).usingRecursiveComparison().ignoringFields("events", "parent", "project").isEqualTo(location);
        assertThat(locations.get(0))
            .hasFieldOrPropertyWithValue("project.name", PROJECT_NAME)
            .hasFieldOrPropertyWithValue("parent.name", SECOND_LOCATION_NAME);
        assertThat(locations.get(0).getEvents()).hasSize(1);
        assertThat(locations.get(0).getEvents().iterator().next()).hasFieldOrPropertyWithValue("name", EVENT_NAME);
        assertThat(locations.get(1)).isNull();
    }

    @Test
    void toEntityWithChild() {
        LocationDTO child = new LocationDTO();
        child.setName(SECOND_LOCATION_NAME);
        locationDTO.setChildren(List.of(child));

        List<LocationDTO> locationDTOs = getLocationDTOS();

        List<Location> locations = fixture.toEntity(locationDTOs);

        assertThat(locations).isNotEmpty().size().isEqualTo(2);
        assertThat(locations.get(0)).usingRecursiveComparison().ignoringFields("events", "children", "project").isEqualTo(location);
        assertThat(locations.get(0)).hasFieldOrPropertyWithValue("project.name", PROJECT_NAME);
        assertThat(locations.get(0).getChildren()).isNotEmpty().size().isEqualTo(1);
        assertThat(locations.get(0).getChildren().iterator().next()).hasFieldOrPropertyWithValue("name", SECOND_LOCATION_NAME);
        assertThat(locations.get(0).getEvents()).hasSize(1);
        assertThat(locations.get(0).getEvents().iterator().next()).hasFieldOrPropertyWithValue("name", EVENT_NAME);
        assertThat(locations.get(1)).isNull();
    }

    @NotNull
    private List<Location> getLocations() {
        List<Location> locations = new ArrayList<>();
        locations.add(location);
        locations.add(null);
        return locations;
    }

    @NotNull
    private List<LocationDTO> getLocationDTOS() {
        List<LocationDTO> locationDTOs = new ArrayList<>();
        locationDTOs.add(locationDTO);
        locationDTOs.add(null);
        return locationDTOs;
    }
}
