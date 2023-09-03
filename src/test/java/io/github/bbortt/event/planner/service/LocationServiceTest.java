package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import io.github.bbortt.event.planner.service.mapper.LocationMapper;
import io.github.bbortt.event.planner.web.rest.LocationResource;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {

    @Mock
    private LocationRepository locationRepositoryMock;

    @Mock
    private LocationMapper locationMapperMock;

    private LocationService fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new LocationService(locationRepositoryMock, locationMapperMock);
    }

    @Test
    void saveChecksMandatoryProjectConstraint() {
        Location location = new Location(); // Note, hast no Project
        LocationDTO locationDTO = new LocationDTO();

        doReturn(location).when(locationMapperMock).toEntity(locationDTO);

        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> fixture.save(locationDTO));

        assertEquals(LocationResource.ENTITY_NAME, exception.getEntityName());
        assertEquals("location.constraints.project", exception.getErrorKey());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verifyNoInteractions(locationRepositoryMock);
    }

    @Test
    void updateChecksMandatoryProjectConstraint() {
        Location location = new Location(); // Note, hast no Project
        LocationDTO locationDTO = new LocationDTO();

        doReturn(location).when(locationMapperMock).toEntity(locationDTO);

        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> fixture.update(locationDTO));

        assertEquals(LocationResource.ENTITY_NAME, exception.getEntityName());
        assertEquals("location.constraints.project", exception.getErrorKey());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verifyNoInteractions(locationRepositoryMock);
    }

    @Test
    void findAllInProjectCallsRepository() {
        Long projectId = 1234L;

        Location location = new Location();
        doReturn(List.of(location)).when(locationRepositoryMock).findAllByParentIsNullAndProject_IdEquals(projectId);

        LocationDTO locationDTO = new LocationDTO();
        doReturn(locationDTO).when(locationMapperMock).toDto(location);

        List<LocationDTO> result = fixture.findAllInProject(projectId);

        assertEquals(1, result.size());
        assertEquals(locationDTO, result.get(0));
    }

    @Test
    void findAllInProjectExceptThisCallsRepository() {
        Long projectId = 1234L;
        Long locationId = 2345L;

        Location location = new Location().id(1234L).withChild(new Location().id(locationId));
        doReturn(List.of(location)).when(locationRepositoryMock).findAllByParentIsNullAndProject_IdEquals(projectId);

        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setChildren(Collections.emptyList());
        doReturn(locationDTO).when(locationMapperMock).toDto(location);

        List<LocationDTO> result = fixture.findAllInProjectExceptThis(projectId, locationId);

        assertEquals(1, result.size());
        assertEquals(locationDTO, result.get(0));
    }
}
