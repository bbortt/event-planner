package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.api.dto.ReadUserProjects200Response;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProjectApiDelegateImpl implements ProjectApiDelegate {

    private final Logger logger = LoggerFactory.getLogger(ProjectApiDelegateImpl.class);

    @Override
    public ResponseEntity<ReadUserProjects200Response> readUserProjects(
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        logger.debug("REST request to get a page of Projects");
        return null;
    }
}
