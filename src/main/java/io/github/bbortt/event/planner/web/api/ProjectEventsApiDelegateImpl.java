package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.EventService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.Event;
import io.github.bbortt.event.planner.service.api.dto.GetProjectEvents200Response;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectEventMapper;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
public class ProjectEventsApiDelegateImpl implements ProjectEventsApiDelegate {

    private static final Logger logger = LoggerFactory.getLogger(ProjectEventsApiDelegateImpl.class);

    private static final String EVENT_ID_ATTRIBUTE_NAME = "id";

    private final EventService eventService;
    private final ProjectService projectService;
    private final ApiProjectEventMapper apiProjectEventMapper;
    private final PaginationUtil paginationUtil;

    public ProjectEventsApiDelegateImpl(
        EventService eventService,
        ProjectService projectService,
        ApiProjectEventMapper apiProjectEventMapper,
        PaginationUtil paginationUtil
    ) {
        this.eventService = eventService;
        this.projectService = projectService;
        this.apiProjectEventMapper = apiProjectEventMapper;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public ResponseEntity<GetProjectEvents200Response> getProjectEvents(
        Long projectId,
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        logger.debug("REST request to get all Events in Project '{}'", projectId);

        projectService.findOneOrThrowEntityNotFoundAlertException(projectId);

        Page<EventDTO> page = eventService.findAllInProject(
            projectId,
            paginationUtil.createPagingInformation(pageSize, pageNumber, sort, EVENT_ID_ATTRIBUTE_NAME)
        );

        return new ResponseEntity<>(
            new GetProjectEvents200Response().contents(page.getContent().stream().map(this::toApiDTO).toList()),
            paginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page),
            HttpStatus.OK
        );
    }

    private Event toApiDTO(EventDTO eventDTO) {
        return apiProjectEventMapper.toApiDTO(eventDTO);
    }
}
