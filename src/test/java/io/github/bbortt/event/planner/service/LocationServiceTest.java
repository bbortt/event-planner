package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import io.github.bbortt.event.planner.service.mapper.LocationMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {

    @Mock
    private LocationMapper locationMapperMock;

    @Mock
    private LocationRepository locationRepositoryMock;

    private LocationService fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new LocationService(locationRepositoryMock, locationMapperMock);
    }

    @Test
    void findAllInProjectCallsRepository() {
        Long projectId = 1234L;

        Location location = new Location();
        doReturn(List.of(location)).when(locationRepositoryMock).findAllByProject_IdEquals(projectId);

        LocationDTO locationDTO = new LocationDTO();
        doReturn(locationDTO).when(locationMapperMock).toDto(location);

        List<LocationDTO> result = fixture.findAllInProject(projectId);

        assertEquals(1, result.size());
        assertEquals(locationDTO, result.get(0));
    }
}
