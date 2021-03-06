package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import io.github.bbortt.event.planner.backend.security.SecurityUtils;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.exception.IdMustBePresentException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Invitation}.
 */
@Service
public class InvitationService {

    private final Logger log = LoggerFactory.getLogger(InvitationService.class);

    private final UserService userService;
    private final ProjectService projectService;

    private final InvitationRepository invitationRepository;

    public InvitationService(UserService userService, ProjectService projectService, InvitationRepository invitationRepository) {
        this.userService = userService;
        this.projectService = projectService;
        this.invitationRepository = invitationRepository;
    }

    /**
     * Save a invitation.
     *
     * @param invitation the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Invitation save(Invitation invitation) {
        log.debug("Request to save Invitation : {}", invitation);
        return invitationRepository.save(invitation);
    }

    /**
     * Get all the invitations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Invitation> findAll(Pageable pageable) {
        log.debug("Request to get all Invitations");
        return invitationRepository.findAll(pageable);
    }

    /**
     * Get one invitation by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Invitation> findOne(Long id) {
        log.debug("Request to get Invitation : {}", id);
        return invitationRepository.findById(id);
    }

    /**
     * Delete the invitation by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Invitation : {}", id);
        invitationRepository.deleteById(id);
    }

    /**
     * Find all Invitations for the given project.
     *
     * @param projectId the id of the project to retrieve invitations for.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Invitation> findAllByProjectId(Long projectId, Pageable pageable) {
        log.debug("Request to get all Invitations for Project {}", projectId);
        return invitationRepository.findAllByProjectId(projectId, pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Invitation> findOneByJhiUserIdAndProjectId(String jhiUserId, Long projectId) {
        log.debug("Request to get Invitation for User {} in Project {}", jhiUserId, projectId);
        return invitationRepository.findOneByJhiUserIdAndProjectId(jhiUserId, projectId);
    }

    /**
     * Accept the invitation identified by the given token, assign the current user.
     *
     * @param token the invitation token.
     */
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void assignCurrentUserToInvitation(String token) {
        log.debug("Request to accept invitation for current user");
        String login = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new).getLogin();
        invitationRepository.assignUserToInvitation(userService.findUserByLogin(login).getId(), token);
    }

    /**
     * Check whether the `token` exists.
     *
     * @param token the invitation token to check.
     * @return true if the token is valid.
     */
    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        log.debug("Request to check token validity");
        return invitationRepository.findByToken(token).isPresent();
    }

    /**
     * Checks whether the given email is still unique in this Project.
     *
     * @param projectId the Project identifier.
     * @param email the value to check.
     * @return true if the value exists.
     */
    @Transactional(readOnly = true)
    public Boolean isEmailExistingInProject(Long projectId, String email) {
        log.debug("Request to check uniqueness of email by projectId : {}", projectId);
        return invitationRepository.findOneByEmailAndProjectId(email, projectId).isPresent();
    }

    /**
     * Not accepted invitations should be automatically deleted after 14 days.
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
    @Transactional
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotAcceptedInvitations() {
        invitationRepository
            .findAllByAcceptedIsFalseAndTokenIsNotNullAndCreatedDateBefore(Instant.now().minus(14, ChronoUnit.DAYS))
            .forEach(
                invitation -> {
                    log.debug("Deleting not accepted invitation {} in project {}", invitation.getEmail(), invitation.getProject().getId());
                    invitationRepository.delete(invitation);
                }
            );
    }

    /**
     * Returns all invitations of current user login / id.
     * @return the current users invitations.
     */
    public List<Invitation> findMine() {
        String jhiUserId = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new).getId();
        log.debug("Request to get my invitations: {}", jhiUserId);
        return invitationRepository.findAllByJhiUserId(jhiUserId);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Invitation`, identified by id. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@locationService.hasAccessToLocation(#invitationId, 'ADMIN', 'SECRETARY')")`
     *
     * @param invitationId the id of the location with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToInvitation(Long invitationId, String... roles) {
        if (invitationId == null) {
            throw new IdMustBePresentException();
        }

        Invitation invitation = findOne(invitationId).orElseThrow(EntityNotFoundException::new);
        return hasAccessToInvitation(invitation, roles);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Invitation`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@locationService.hasAccessToLocation(#invitation, 'ADMIN', 'SECRETARY')")`
     *
     * @param invitation the entity with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToInvitation(Invitation invitation, String... roles) {
        if (invitation == null) {
            throw new BadRequestException();
        }

        return projectService.hasAccessToProject(invitation.getProject(), roles);
    }
}
