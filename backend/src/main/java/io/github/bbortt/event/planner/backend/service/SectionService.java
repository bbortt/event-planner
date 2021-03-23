package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.exception.IdMustBePresentException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Section}.
 */
@Service
public class SectionService {

    private final Logger log = LoggerFactory.getLogger(SectionService.class);

    private final ProjectService projectService;

    private final SectionRepository sectionRepository;

    public SectionService(ProjectService projectService, EventService eventService, SectionRepository sectionRepository) {
        this.projectService = projectService;
        this.sectionRepository = sectionRepository;
    }

    /**
     * Save a section.
     *
     * @param section the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Section save(Section section) {
        log.debug("Request to save Section : {}", section);

        if (section.getResponsibility() != null && section.getUser() != null) {
            log.error("Section does contain responsibility AND user!");
            throw new BadRequestException();
        }

        return sectionRepository.save(section);
    }

    /**
     * Get all the sections.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Section> findAll(Pageable pageable) {
        log.debug("Request to get all Sections");
        return sectionRepository.findAll(pageable);
    }

    /**
     * Get all sections and their corresponding events for the given location.
     *
     * @param locationId the location to retrieve sections and events for.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Section> findAllByLocationIdJoinEvents(Long locationId) {
        log.debug("Request to get Sections and Events by Location : {}", locationId);
        return sectionRepository.findAllByLocationIdJoinEventsOrderByNameAsc(locationId);
    }

    /**
     * Get one section by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Section> findOne(Long id) {
        log.debug("Request to get Section : {}", id);
        return sectionRepository.findById(id);
    }

    /**
     * Get section name by id.
     *
     * @param id the id of the entity.
     * @return name of the entity.
     */
    @Transactional(readOnly = true)
    public Optional<String> findNameBySectionId(Long id) {
        log.debug("Request to get name of Section : {}", id);
        return sectionRepository.findNameBySectionId(id);
    }

    /**
     * Delete the section by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Section : {}", id);
        sectionRepository.deleteById(id);
    }

    /**
     * Checks whether the given name exists in this Location.
     *
     * @param locationId the Location identifier.
     * @param name the value to check.
     * @return true if the value exists.
     */
    @Transactional(readOnly = true)
    public Boolean isNameExistingInLocation(Long locationId, String name) {
        log.debug("Request to check uniqueness of name '{}' by locationId : {}", name, locationId);
        return sectionRepository.findOneByNameAndLocationId(name, locationId).isPresent();
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Section`, identified by id. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@sectionService.hasAccessToSection(#section, 'ADMIN', 'SECRETARY')")`
     *
     * @param sectionId the id of the location with a linked project to check.
     * @param roles     to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToSection(Long sectionId, String... roles) {
        if (sectionId == null) {
            throw new IdMustBePresentException();
        }

        Section section = findOne(sectionId).orElseThrow(EntityNotFoundException::new);
        return hasAccessToSection(section, roles);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Section`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@sectionService.hasAccessToSection(#section, 'ADMIN', 'SECRETARY')")`
     *
     * @param section the entity with a linked project to check.
     * @param roles   to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToSection(Section section, String... roles) {
        return projectService.hasAccessToProject(section.getLocation().getProject(), roles);
    }
}
