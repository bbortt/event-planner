package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.service.InvitationService;
import io.github.bbortt.event.planner.backend.service.ProjectService;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Project}.
 */
@RestController
@RequestMapping("/api")
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "project";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectService projectService;
    private final InvitationService invitationService;

    public ProjectResource(ProjectService projectService, InvitationService invitationService) {
        this.projectService = projectService;
        this.invitationService = invitationService;
    }

    /**
     * {@code POST  /projects} : Create a new project.
     *
     * @param createProjectDTO the DTO to create a project from.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new project, or with status {@code 400 (Bad Request)} if the project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> createProject(@Valid @RequestBody CreateProjectDTO createProjectDTO) throws URISyntaxException {
        log.debug("REST request to save Project from DTO : {}", createProjectDTO);
        Project result = projectService.create(createProjectDTO);
        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getName()))
            .body(result);
    }

    /**
     * {@code PUT  /projects} : Updates an existing project.
     *
     * @param project the project to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated project, or with status {@code 400 (Bad Request)} if the project is not valid, or with status {@code 500 (Internal Server Error)} if the project couldn't be updated.
     */
    @PutMapping("/projects")
    @PreAuthorize("@projectService.hasAccessToProject(#project, \"" + RolesConstants.ADMIN + "\")")
    public ResponseEntity<Project> updateProject(@Valid @RequestBody Project project) {
        log.debug("REST request to update Project : {}", project);
        if (project.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Project result = projectService.save(project);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, project.getName()))
            .body(result);
    }

    /**
     * {@code GET  /projects} : get all the projects.
     *
     * @param loadAll loads projects for current user by default.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projects in body.
     */
    @GetMapping("/projects")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Project>> getProjects(
        @RequestParam(name = "loadArchived", required = false) Optional<Boolean> loadArchived,
        @RequestParam(name = "loadAll", required = false) Optional<Boolean> loadAll,
        Pageable pageable
    ) {
        log.debug("REST request to get a page of Projects: { loadArchived: {}, loadAll: {} }", loadArchived, loadAll);

        Page<Project> page = projectService.findMineOrAllByArchived(loadAll.orElse(false), loadArchived.orElse(false), pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /projects/myRoles} : get each role per project.
     *
     * @return the list of role per projects in body.
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/projects/rolePerProject")
    public Map<Long, String> getRolePerProject() {
        log.debug("REST request to get Roles per Project");
        return invitationService
            .findMine()
            .stream()
            .collect(Collectors.toMap(invitation -> invitation.getProject().getId(), invitation -> invitation.getRole().getName()));
    }

    /**
     * {@code GET  /projects/:id} : get the "id" project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{id}")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#id, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        Optional<Project> project = projectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(project);
    }

    /**
     * {@code DELETE  /projects/:id} : delete the "id" project.
     *
     * @param id the id of the project to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/projects/{id}")
    @PreAuthorize("@projectService.hasAccessToProject(#id, \"" + RolesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);
        String name = projectService.findNameByProjectId(id).orElseThrow(EntityNotFoundException::new);
        projectService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, name)).build();
    }

    /**
     * {@code PUT  /projects/:id/archive} : archive the "id" project.
     *
     * @param id the id of the project to archive.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PutMapping("/projects/{id}/archive")
    @PreAuthorize("@projectService.hasAccessToProject(#id, \"" + RolesConstants.ADMIN + "\")")
    public ResponseEntity<Void> archiveProject(@PathVariable Long id) {
        log.debug("REST request to archive Project : {}", id);
        projectService.archive(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code GET  /projects/:id/users} : get all users for the "id" project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the users, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{id}/users")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#id, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<Set<UserDTO>> getProjectUsers(@PathVariable Long id) {
        log.debug("REST request to get Users for Project : {}", id);
        Set<UserDTO> users = projectService.findUsersByProject(id);
        return ResponseEntity.ok(users);
    }
}
