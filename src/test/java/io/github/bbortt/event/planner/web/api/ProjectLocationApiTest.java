package io.github.bbortt.event.planner.web.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.service.LocationService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectLocations200Response;
import io.github.bbortt.event.planner.service.api.dto.Location;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectLocationMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ProjectLocationApiTest {

    @Mock
    private LocationService locationServiceMock;

    @Mock
    private ProjectService projectServiceMock;

    @Mock
    private ApiProjectLocationMapper apiProjectLocationMapperMock;

    private ProjectLocationApiDelegateImpl fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ProjectLocationApiDelegateImpl(locationServiceMock, projectServiceMock, apiProjectLocationMapperMock);
    }

    @Test
    void getProjectLocationsCallsService() {
        Long projectId = 1234L;

        // Project by ID exists
        doReturn(new ProjectDTO()).when(projectServiceMock).findOneOrThrowEntityNotFoundAlertException(projectId);

        LocationDTO locationDTO = new LocationDTO();
        doReturn(List.of(locationDTO)).when(locationServiceMock).findAllInProject(projectId);

        Location location = new Location();
        doReturn(location).when(apiProjectLocationMapperMock).toApiDTO(locationDTO);

        ResponseEntity<GetProjectLocations200Response> result = fixture.getProjectLocations(projectId);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        GetProjectLocations200Response response = result.getBody();
        assertNotNull(response);

        assertEquals(1, response.getContents().size());
        assertEquals(location, response.getContents().get(0));
    }
}
