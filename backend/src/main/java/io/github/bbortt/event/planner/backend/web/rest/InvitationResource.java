package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.service.InvitationService;
import io.github.bbortt.event.planner.backend.service.MailService;
import io.github.bbortt.event.planner.backend.service.dto.InvitationDTO;
import io.github.bbortt.event.planner.backend.service.mapper.InvitationMapper;
import io.github.bbortt.event.planner.backend.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Invitation}.
 */
@RestController
@RequestMapping("/api")
public class InvitationResource {

    private final Logger log = LoggerFactory.getLogger(InvitationResource.class);

    private static final String ENTITY_NAME = "invitation";

    private final MailService mailService;

    private final InvitationService invitationService;

    private final RoleRepository roleRepository;

    private final InvitationMapper invitationMapper;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public InvitationResource(
        MailService mailService,
        InvitationService invitationService,
        RoleRepository roleRepository,
        InvitationMapper invitationMapper
    ) {
        this.mailService = mailService;
        this.invitationService = invitationService;
        this.roleRepository = roleRepository;
        this.invitationMapper = invitationMapper;
    }

    /**
     * {@code POST  /invitations} : Create a new invitation.
     *
     * @param invitation the invitation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new invitation, or with status {@code 400 (Bad Request)} if the invitation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/invitations")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#invitation.project, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<InvitationDTO> createInvitation(@Valid @RequestBody InvitationDTO invitation) throws URISyntaxException {
        log.debug("REST request to save Invitation : {}", invitation);
        if (invitation.getId() != null) {
            throw new BadRequestAlertException("A new invitation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (invitation.getRole().equals(roleRepository.roleAdmin())) {
            throw new BadRequestAlertException("Cannot invite a second project administrator", ENTITY_NAME, "badRequest");
        }
        invitation.setToken(UUID.randomUUID().toString());
        Invitation result = invitationService.save(invitationMapper.invitationFromDTO(invitation));

        mailService.sendInvitationMail(result);

        return ResponseEntity
            .created(new URI("/api/invitations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(invitationMapper.dtoFromInvitation(result));
    }

    /**
     * {@code PUT  /invitations} : Updates an existing invitation.
     *
     * @param invitation the invitation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated invitation, or with status {@code 400 (Bad Request)} if the invitation is not valid, or with status {@code 500 (Internal Server Error)} if the invitation couldn't be updated.
     */
    @PutMapping("/invitations")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#invitation.project, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<InvitationDTO> updateInvitation(@Valid @RequestBody InvitationDTO invitation) {
        log.debug("REST request to update Invitation : {}", invitation);
        if (invitation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Invitation result = invitationService.save(invitationMapper.invitationFromDTO(invitation));
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, invitation.getId().toString()))
            .body(invitationMapper.dtoFromInvitation(result));
    }

    /**
     * {@code GET  /invitations} : get all the invitations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of invitations in body.
     */
    @GetMapping("/invitations")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<InvitationDTO>> getAllInvitations(Pageable pageable) {
        log.debug("REST request to get a page of Invitations");
        Page<Invitation> page = invitationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity
            .ok()
            .headers(headers)
            .body(page.getContent().stream().map(invitationMapper::dtoFromInvitation).collect(Collectors.toList()));
    }

    /**
     * {@code GET  /invitations/:id} : get the "id" invitation.
     *
     * @param id the id of the invitation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the invitation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/invitations/{id}")
    @PreAuthorize("@invitationService.hasAccessToInvitation(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<InvitationDTO> getInvitation(@PathVariable Long id) {
        log.debug("REST request to get Invitation : {}", id);
        Optional<Invitation> invitation = invitationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(invitation.map(invitationMapper::dtoFromInvitation));
    }

    @GetMapping("/invitations/project/{projectId}")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<List<InvitationDTO>> getInvitationsByProjectId(@PathVariable("projectId") Long projectId, Pageable pageable) {
        Page<Invitation> page = invitationService.findAllByProjectId(projectId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(
            page.getContent().stream().map(invitationMapper::dtoFromInvitation).collect(Collectors.toList()),
            headers,
            HttpStatus.OK
        );
    }

    /**
     * {@code DELETE  /invitations/:id} : delete the "id" invitation.
     *
     * @param id the id of the invitation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/invitations/{id}")
    @PreAuthorize("@invitationService.hasAccessToInvitation(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Void> deleteInvitation(@PathVariable Long id) {
        log.debug("REST request to delete Invitation : {}", id);
        invitationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/invitations/accept")
    public void assignCurrentUserToInvitation(@NotEmpty @RequestBody String token) {
        log.debug("REST request to accept invitation for current user by token");
        invitationService.assignCurrentUserToInvitation(token);
    }

    @PostMapping("/invitations/token-validity")
    public boolean checkTokenValidity(@NotEmpty @RequestBody String token) {
        log.debug("REST request to check token validity");
        return invitationService.isTokenValid(token);
    }

    /**
     * {@code POST /invitations/project/:projectId/email-exists} : Whether the given email exists in this Project.
     *
     * @param projectId the Project identifier.
     * @param email the value to check.
     * @return true if the value exists.
     */
    @PostMapping("/invitations/project/{projectId}/email-exists")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Boolean> isEmailExistingInProject(@PathVariable Long projectId, @RequestBody String email) {
        log.debug("REST request to check uniqueness of email '{}' by projectId : {}", email, projectId);
        Boolean isExisting = invitationService.isEmailExistingInProject(projectId, email);
        return ResponseEntity.ok(isExisting);
    }
}
