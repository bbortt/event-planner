package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.Optional;
import javax.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final MailService mailService;

    public InvitationService(InvitationRepository invitationRepository, UserRepository userRepository, MailService mailService) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
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

    @Transactional
    public void assignCurrentUserToInvitation(String token) {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalArgumentException("No user Login found!"));
        assignUserByLoginToInvitation(login, token);
    }

    @Transactional
    public void assignUserByLoginToInvitation(String login, String token) {
        User user = userRepository
            .findOneByLogin(login)
            .orElseThrow(() -> new EntityNotFoundException("User with login " + login + " not found"));
        invitationRepository.assignUserToInvitation(user.getId(), token);
        mailService.sendInvitationMail(user, token);
    }

    public boolean isTokenValid(String token) {
        return invitationRepository.findByToken(token).isPresent();
    }
}
