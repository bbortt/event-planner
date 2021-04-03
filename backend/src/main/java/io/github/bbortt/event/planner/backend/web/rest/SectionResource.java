package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.service.SectionService;
import io.github.bbortt.event.planner.backend.service.dto.SectionDTO;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.mapper.EventMapper;
import io.github.bbortt.event.planner.backend.service.mapper.LocationMapper;
import io.github.bbortt.event.planner.backend.service.mapper.SectionMapper;
import io.github.bbortt.event.planner.backend.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Section}.
 */
@RestController
@RequestMapping("/api")
public class SectionResource {

    private final Logger log = LoggerFactory.getLogger(SectionResource.class);

    private static final String ENTITY_NAME = "section";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SectionService sectionService;

    private final LocationMapper locationMapper;
    private final SectionMapper sectionMapper;
    private final EventMapper eventMapper;

    public SectionResource(
        SectionService sectionService,
        LocationMapper locationMapper,
        SectionMapper sectionMapper,
        EventMapper eventMapper
    ) {
        this.sectionService = sectionService;
        this.locationMapper = locationMapper;
        this.sectionMapper = sectionMapper;
        this.eventMapper = eventMapper;
    }

    /**
     * {@code POST  /sections} : Create a new section.
     *
     * @param section the section to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new section, or with status {@code 400 (Bad Request)} if the section has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sections")
    @PreAuthorize("@sectionService.hasAccessToSection(#section, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<SectionDTO> createSection(@Valid @RequestBody SectionDTO section) throws URISyntaxException {
        log.debug("REST request to save Section : {}", section);
        if (section.getId() != null) {
            throw new BadRequestAlertException("A new section cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Section result = sectionService.save(fromDTO(section));
        return ResponseEntity
            .created(new URI("/api/sections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getName()))
            .body(toDTO(result));
    }

    /**
     * {@code PUT  /sections} : Updates an existing section.
     *
     * @param section the section to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated section, or with status {@code 400 (Bad Request)} if the section is not valid, or with status {@code 500 (Internal Server Error)} if the section couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sections")
    @PreAuthorize("@sectionService.hasAccessToSection(#section, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<SectionDTO> updateSection(@Valid @RequestBody SectionDTO section) throws URISyntaxException {
        log.debug("REST request to update Section : {}", section);
        if (section.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Section result = sectionService.save(fromDTO(section));
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, section.getName()))
            .body(toDTO(result));
    }

    /**
     * {@code GET  /sections} : get all the sections.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sections in body.
     */
    @GetMapping("/sections")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<SectionDTO>> getAllSections(Pageable pageable) {
        log.debug("REST request to get a page of Sections");
        Page<Section> page = sectionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent().stream().map(this::toDTO).collect(Collectors.toList()));
    }

    /**
     * {@code GET  /sections/:id} : get the "id" section.
     *
     * @param id the id of the section to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the section, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sections/{id}")
    @PreAuthorize(
        "@sectionService.hasAccessToSection(#id, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<SectionDTO> getSection(@PathVariable Long id) {
        log.debug("REST request to get Section : {}", id);
        Optional<Section> section = sectionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(section.map(this::toDTO));
    }

    /**
     * {@code POST /sections/location/:locationId/name-exists} : Whether the given name exists in this Location.
     *
     * @param locationId the Location identifier.
     * @param name the value to check.
     * @return true if the value exists.
     */
    @PostMapping("/sections/location/{locationId}/name-exists")
    @PreAuthorize(
        "@locationService.hasAccessToLocation(#locationId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<Boolean> isNameExistingInLocation(@PathVariable Long locationId, @RequestBody String name) {
        log.debug("REST request to check uniqueness of name '{}' by locationId : {}", name, locationId);
        Boolean isExisting = sectionService.isNameExistingInLocation(locationId, name);
        return ResponseEntity.ok(isExisting);
    }

    /**
     * {@code DELETE  /sections/:id} : delete the "id" section.
     *
     * @param id the id of the section to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sections/{id}")
    @PreAuthorize("@sectionService.hasAccessToSection(#id, \"" + RolesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        log.debug("REST request to delete Section : {}", id);
        String name = sectionService.findNameBySectionId(id).orElseThrow(EntityNotFoundException::new);
        sectionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, name)).build();
    }

    private Section fromDTO(SectionDTO sectionDTO) {
        return sectionMapper.sectionFromDTO(
            sectionDTO,
            locationMapper.locationFromDTO(sectionDTO.getLocation(), null),
            sectionDTO.getEvents().stream().map(eventDTO -> eventMapper.eventFromDTO(eventDTO, null)).collect(Collectors.toSet())
        );
    }

    private SectionDTO toDTO(Section section) {
        return sectionMapper.dtoFromSection(
            section,
            locationMapper.dtoFromLocation(section.getLocation(), null),
            section.getEvents().stream().map(event -> eventMapper.dtoFromEvent(event, null)).collect(Collectors.toSet())
        );
    }
}
