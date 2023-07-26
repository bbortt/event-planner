package io.github.bbortt.event.planner.web.api.mapper;

import io.github.bbortt.event.planner.service.api.dto.Location;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

class ApiProjectLocationMapperTest {

    private Location location;
    private LocationDTO locationDTO;

    private ApiProjectLocationMapperImpl fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ApiProjectLocationMapperImpl();

        Location childLocation = new Location().id(2345L).name("child location");
        location = new Location().id(1234L).name("location name").children(List.of(childLocation));

        LocationDTO childLocationDTO = new LocationDTO();
        childLocationDTO.setId(childLocation.getId());
        childLocationDTO.setName(childLocation.getName());
        childLocationDTO.setChildren(Collections.emptyList());

        locationDTO = new LocationDTO();
        locationDTO.setId(location.getId());
        locationDTO.setName(location.getName());
        locationDTO.setChildren(List.of(childLocationDTO));
    }

    @Test
    void toApiDTO() {
        Location result = fixture.toApiDTO(locationDTO);

        assertThat(result).isNotNull();
        assertThat(result).usingRecursiveComparison().isEqualTo(location);
    }

    @Test
    void toApiDTOIsNullResistant() {
        assertNull(fixture.toApiDTO(null));
    }
}
