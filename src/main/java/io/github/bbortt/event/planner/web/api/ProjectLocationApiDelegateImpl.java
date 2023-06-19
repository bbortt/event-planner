package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.LocationService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectLocations200Response;
import io.github.bbortt.event.planner.service.api.dto.Location;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectLocationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectLocationApiDelegateImpl implements ProjectLocationApiDelegate {

    private final Logger log = LoggerFactory.getLogger(ProjectLocationApiDelegateImpl.class);

    private final LocationService locationService;
    private final ProjectService projectService;
    private final ApiProjectLocationMapper apiProjectLocationMapper;

    public ProjectLocationApiDelegateImpl(
        LocationService locationService,
        ProjectService projectService,
        ApiProjectLocationMapper apiProjectLocationMapper
    ) {
        this.locationService = locationService;
        this.projectService = projectService;
        this.apiProjectLocationMapper = apiProjectLocationMapper;
    }

    @Override
    public ResponseEntity<GetProjectLocations200Response> getProjectLocations(Long projectId) {
        log.debug("REST request to get all Locations in Project '{}'", projectId);

        projectService.findOneOrThrowEntityNotFoundAlertException(projectId);

        return new ResponseEntity<>(
            new GetProjectLocations200Response()
                .contents(locationService.findAllInProject(projectId).stream().map(this::toApiDTO).toList()),
            HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<GetProjectLocations200Response> getProjectLocationsWithoutSelf(Long projectId, Long locationId) {
        log.debug("REST request to get all Locations except '{}' in Project '{}'", locationId, projectId);

        projectService.findOneOrThrowEntityNotFoundAlertException(projectId);

        return new ResponseEntity<>(
            new GetProjectLocations200Response()
                .contents(locationService.findAllInProjectExceptThis(projectId, locationId).stream().map(this::toApiDTO).toList()),
            HttpStatus.OK
        );
    }

    private Location toApiDTO(LocationDTO locationDTO) {
        return apiProjectLocationMapper.toApiDTO(locationDTO);
    }
}
