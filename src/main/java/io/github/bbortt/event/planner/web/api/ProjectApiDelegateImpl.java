package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectMembers200Response;
import io.github.bbortt.event.planner.service.api.dto.GetUserProjects200Response;
import io.github.bbortt.event.planner.service.api.dto.InviteMemberToProjectRequestInner;
import io.github.bbortt.event.planner.service.api.dto.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProjectApiDelegateImpl implements ProjectApiDelegate {

    private final Logger logger = LoggerFactory.getLogger(ProjectApiDelegateImpl.class);

    private static final String PROJECT_ID_ATTRIBUTE_NAME = "id";

    private final ProjectService projectService;
    private final PaginationUtil paginationUtil;

    public ProjectApiDelegateImpl(ProjectService projectService, PaginationUtil paginationUtil) {
        this.projectService = projectService;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public ResponseEntity<GetProjectMembers200Response> getProjectMembers(
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        throw new NotImplementedException();
    }

    @Override
    public ResponseEntity<GetUserProjects200Response> getUserProjects(
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        logger.debug("REST request to get a page of Projects");
        Slice<ProjectDTO> slice = projectService.findForCurrentUser(
            paginationUtil.createPagingInformation(pageSize, pageNumber, sort, PROJECT_ID_ATTRIBUTE_NAME)
        );
        HttpHeaders headers = paginationUtil.generateSliceHttpHeaders(slice);
        return ResponseEntity
            .ok()
            .headers(headers)
            .body(new GetUserProjects200Response().contents(slice.getContent().stream().map(this::projectFromProjectDTO).toList()));
    }

    @Override
    public ResponseEntity<Void> inviteMemberToProject(
        Long projectId,
        List<InviteMemberToProjectRequestInner> inviteMemberToProjectRequestInner
    ) {
        throw new NotImplementedException();
    }

    private Project projectFromProjectDTO(ProjectDTO projectDTO) {
        return new Project()
            .id(projectDTO.getId())
            .name(projectDTO.getName())
            .description(projectDTO.getDescription())
            .startDate(LocalDateTime.ofInstant(projectDTO.getStartDate(), ZoneId.systemDefault()).toLocalDate())
            .endDate(LocalDateTime.ofInstant(projectDTO.getEndDate(), ZoneId.systemDefault()).toLocalDate());
    }
}
