package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Invitation}.
 */
@Service
public class InvitationService {

    private final Logger log = LoggerFactory.getLogger(InvitationService.class);

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;

    public InvitationService(InvitationRepository invitationRepository, UserRepository userRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
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
     * @param pageable  the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Invitation> findAllByProjectId(Long projectId, Pageable pageable) {
        log.debug("Request to get all Invitations for Project {}", projectId);
        return invitationRepository.findAllByProjectId(projectId, pageable);
    }

    /**
     * Accept the invitation identified by the given token, assign the current user.
     *
     * @param token the invitation token.
     */
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void assignCurrentUserToInvitation(String token) {
        log.debug("Request to accept invitation for current user by token : {}", token);
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(IllegalArgumentException::new);
        assignUserByLoginToInvitation(login, token);
    }

    /**
     * Accept the invitation identified by the given token, assign the user identified by `login`.
     *
     * @param login the user login.
     * @param token the invitation token.
     */
    @Transactional
    public void assignUserByLoginToInvitation(String login, String token) {
        log.debug("Request to accept invitation for user '{}' by token : {}", login, token);
        User user = userRepository.findOneByLogin(login.toLowerCase()).orElseThrow(IllegalArgumentException::new);
        invitationRepository.assignUserToInvitation(user.getId(), token);
    }

    /**
     * Check whether the `token` exists.
     *
     * @param token the invitation token to check.
     * @return true if the token is valid.
     */
    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        log.debug("Request to check token validity : {}", token);
        return invitationRepository.findByToken(token).isPresent();
    }
}
