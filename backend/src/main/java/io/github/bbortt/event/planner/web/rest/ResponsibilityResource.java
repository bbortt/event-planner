package io.github.bbortt.event.planner.web.rest;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.service.ResponsibilityService;
import io.github.bbortt.event.planner.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST controller for managing {@link io.github.bbortt.event.planner.domain.Responsibility}.
 */
@RestController
@RequestMapping("/api")
public class ResponsibilityResource {
    private final Logger log = LoggerFactory.getLogger(ResponsibilityResource.class);

    private static final String ENTITY_NAME = "responsibility";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResponsibilityService responsibilityService;

    public ResponsibilityResource(ResponsibilityService responsibilityService) {
        this.responsibilityService = responsibilityService;
    }

    /**
     * {@code POST  /responsibilities} : Create a new responsibility.
     *
     * @param responsibility the responsibility to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new responsibility, or with status {@code 400 (Bad Request)} if the responsibility has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/responsibilities")
    @PreAuthorize(
        "@responsibilityService.hasAccessToResponsibility(#responsibility, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\")"
    )
    public ResponseEntity<Responsibility> createResponsibility(@Valid @RequestBody Responsibility responsibility)
        throws URISyntaxException {
        log.debug("REST request to save Responsibility : {}", responsibility);
        if (responsibility.getId() != null) {
            throw new BadRequestAlertException("A new responsibility cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Responsibility result = responsibilityService.save(responsibility);
        return ResponseEntity
            .created(new URI("/api/responsibilities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getName()))
            .body(result);
    }

    /**
     * {@code PUT  /responsibilities} : Updates an existing responsibility.
     *
     * @param responsibility the responsibility to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated responsibility, or with status {@code 400 (Bad Request)} if the responsibility is not valid, or with status {@code 500 (Internal Server Error)} if the responsibility couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/responsibilities")
    @PreAuthorize(
        "@responsibilityService.hasAccessToResponsibility(#responsibility, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\")"
    )
    public ResponseEntity<Responsibility> updateResponsibility(@Valid @RequestBody Responsibility responsibility)
        throws URISyntaxException {
        log.debug("REST request to update Responsibility : {}", responsibility);
        if (responsibility.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Responsibility result = responsibilityService.save(responsibility);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, responsibility.getName()))
            .body(result);
    }

    /**
     * {@code GET  /responsibilities} : get all the responsibilities.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of responsibilities in body.
     */
    @GetMapping("/responsibilities")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<Responsibility>> getAllResponsibilities(Pageable pageable) {
        log.debug("REST request to get a page of Responsibilities");
        Page<Responsibility> page = responsibilityService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /responsibilities/:id} : get the "id" responsibility.
     *
     * @param id the id of the responsibility to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the responsibility, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/responsibilities/{id}")
    @PreAuthorize(
        "@responsibilityService.hasAccessToResponsibility(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<Responsibility> getResponsibility(@PathVariable Long id) {
        log.debug("REST request to get Responsibility : {}", id);
        Optional<Responsibility> responsibility = responsibilityService.findOne(id);
        return ResponseUtil.wrapOrNotFound(responsibility);
    }

    /**
     * {@code GET /responsibilities/project/:projectId} : get Responsibilities for Project.
     *
     * @param projectId the id of the project to retrieve responsibilities for.
     * @return the list of entities.
     */
    @GetMapping("/responsibilities/project/{projectId}")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#projectId, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<List<Responsibility>> getResponsibilitiesByProjectId(@PathVariable Long projectId, Sort sort) {
        log.debug("REST request to get Responsibilities by projectId : {}", projectId);
        List<Responsibility> responsibilities = responsibilityService.findAllByProjectId(projectId, sort);
        return ResponseEntity.ok(responsibilities);
    }

    /**
     * {@code POST /responsibilities/project/:projectId/name-exists} : Whether the given name exists in this Project.
     *
     * @param projectId the Project identifier.
     * @param name the value to check.
     * @return true if the value exists.
     */
    @PostMapping("/responsibilities/project/{projectId}/name-exists")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Boolean> isNameExistingInProject(@PathVariable Long projectId, @RequestBody String name) {
        log.debug("REST request to check uniqueness of name '{}' by projectId : {}", name, projectId);
        Boolean isExisting = responsibilityService.isNameExistingInProject(projectId, name);
        return ResponseEntity.ok(isExisting);
    }

    /**
     * {@code DELETE  /responsibilities/:id} : delete the "id" responsibility.
     *
     * @param id the id of the responsibility to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/responsibilities/{id}")
    @PreAuthorize(
        "@responsibilityService.hasAccessToResponsibility(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<Void> deleteResponsibility(@PathVariable Long id) {
        log.debug("REST request to delete Responsibility : {}", id);
        String name = responsibilityService.findNameByResponsibilityId(id).orElseThrow(EntityNotFoundException::new);
        responsibilityService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, name)).build();
    }
}
