package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetUserProjects200Response;
import io.github.bbortt.event.planner.service.api.dto.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectMapper;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.ResponseUtil;

@RestController
public class ProjectApiDelegateImpl implements ProjectApiDelegate {

    private static final Logger logger = LoggerFactory.getLogger(ProjectApiDelegateImpl.class);

    public static final String ENTITY_NAME = "project";
    private static final String PROJECT_ID_ATTRIBUTE_NAME = "id";

    private final ProjectService projectService;
    private final ApiProjectMapper apiProjectMapper;
    private final PaginationUtil paginationUtil;

    public ProjectApiDelegateImpl(ProjectService projectService, ApiProjectMapper apiProjectMapper, PaginationUtil paginationUtil) {
        this.projectService = projectService;
        this.apiProjectMapper = apiProjectMapper;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public ResponseEntity<Project> findProjectByToken(String projectToken) {
        logger.debug("REST request to get Project by token '{}'", projectToken);

        return ResponseUtil.wrapOrNotFound(projectService.findOneByToken(projectToken).map(apiProjectMapper::toApiDTO));
    }

    @Override
    public ResponseEntity<GetUserProjects200Response> getUserProjects(
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        logger.debug("REST request to get a page of Projects");

        Slice<ProjectDTO> slice = projectService.findAllNotArchivedForCurrentUser(
            paginationUtil.createPagingInformation(pageSize, pageNumber, sort, PROJECT_ID_ATTRIBUTE_NAME)
        );

        HttpHeaders headers = paginationUtil.generateSliceHttpHeaders(slice);

        return ResponseEntity
            .ok()
            .headers(headers)
            .body(new GetUserProjects200Response().contents(slice.getContent().stream().map(apiProjectMapper::toApiDTO).toList()));
    }
}
