package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.repository.ResponsibilityRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Responsibility}.
 */
@Service
@Transactional
public class ResponsibilityService {

    private final Logger log = LoggerFactory.getLogger(ResponsibilityService.class);

    private final ResponsibilityRepository responsibilityRepository;

    public ResponsibilityService(ResponsibilityRepository responsibilityRepository) {
        this.responsibilityRepository = responsibilityRepository;
    }

    /**
     * Save a responsibility.
     *
     * @param responsibility the entity to save.
     * @return the persisted entity.
     */
    public Responsibility save(Responsibility responsibility) {
        log.debug("Request to save Responsibility : {}", responsibility);
        return responsibilityRepository.save(responsibility);
    }

    /**
     * Get all the responsibilities.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Responsibility> findAll(Pageable pageable) {
        log.debug("Request to get all Responsibilities");
        return responsibilityRepository.findAll(pageable);
    }

    /**
     * Get one responsibility by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Responsibility> findOne(Long id) {
        log.debug("Request to get Responsibility : {}", id);
        return responsibilityRepository.findById(id);
    }

    /**
     * Delete the responsibility by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Responsibility : {}", id);
        responsibilityRepository.deleteById(id);
    }

    /**
     * Find all Responsibilities for the given Project.
     *
     * @param projectId the id of the project to retrieve responsibilities for.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<Responsibility> findAllByProjectId(Long projectId, Pageable pageable) {
        log.debug("Request to get all Responsibilities for Project {}", projectId);
        return responsibilityRepository.findAllByProjectId(projectId, pageable);
    }
}
