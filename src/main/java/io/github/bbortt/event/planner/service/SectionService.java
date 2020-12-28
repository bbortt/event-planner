package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Section;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.repository.SectionRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.SecurityUtils;
import io.github.bbortt.event.planner.service.exception.EntityNotFoundException;
import java.util.Arrays;
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

    private final SectionRepository sectionRepository;
    private final RoleRepository roleRepository;

    public SectionService(SectionRepository sectionRepository, RoleRepository roleRepository) {
        this.sectionRepository = sectionRepository;
        this.roleRepository = roleRepository;
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
     * Checks if the current user has access to the `Project` linked to the given `Section`, identified by id. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@sectionService.hasAccessToSection(#location, 'ADMIN', 'SECRETARY')")`
     *
     * @param sectionId the id of the location with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToSection(Long sectionId, String... roles) {
        Optional<Section> section = findOne(sectionId);
        return section.map(value -> hasAccessToSection(value, roles)).orElseThrow(EntityNotFoundException::new);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Section`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@sectionService.hasAccessToSection(#location, 'ADMIN', 'SECRETARY')")`
     *
     * @param section the entity with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToSection(Section section, String... roles) {
        return (
            SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) ||
            roleRepository.hasAnyRoleInProject(
                section.getLocation().getProject(),
                SecurityUtils.getCurrentUserLogin().orElseThrow(IllegalArgumentException::new),
                Arrays.asList(roles)
            )
        );
    }
}
