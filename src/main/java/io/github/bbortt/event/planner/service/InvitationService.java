package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import java.util.Optional;
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
@Transactional
public class InvitationService {
    private final Logger log = LoggerFactory.getLogger(InvitationService.class);

    private final InvitationRepository invitationRepository;

    public InvitationService(InvitationRepository invitationRepository) {
        this.invitationRepository = invitationRepository;
    }

    /**
     * Save a invitation.
     *
     * @param invitation the entity to save.
     * @return the persisted entity.
     */
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
    public void delete(Long id) {
        log.debug("Request to delete Invitation : {}", id);
        invitationRepository.deleteById(id);
    }
}
