package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.api.dto.GetProjectLocations200Response;
import io.github.bbortt.event.planner.service.api.dto.Location;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectLocationApiDelegateImpl implements ProjectLocationApiDelegate {

    private final Logger log = LoggerFactory.getLogger(ProjectLocationApiDelegateImpl.class);

    @Override
    public ResponseEntity<GetProjectLocations200Response> getProjectLocations(Long projectId) {
        log.debug("REST request to get all Locations in Project '{}'", projectId);

        return ResponseEntity.ok(
            new GetProjectLocations200Response()
                .contents(
                    List.of(
                        new Location().id(1234L).name("some location"),
                        new Location()
                            .id(234L)
                            .name("another location")
                            .children(List.of(new Location().id(12356L).name("yet another location")))
                    )
                )
        );
    }
}
