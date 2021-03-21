package io.github.bbortt.event.planner.backend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.domain.User;
import io.github.bbortt.event.planner.backend.repository.AuthorityRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.SectionService;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SectionResource} REST controller.
 */
class SectionResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "sectionresourceit-login";
    private static final String TEST_ADMIN_LOGIN = "sectionresourceit-admin";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private SectionService sectionService;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSectionMockMvc;

    private Section section;
    private Invitation invitation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Section createEntity(EntityManager em) {
        Section section = new Section().name(DEFAULT_NAME);
        // Add required entity
        Location location;
        if (TestUtil.findAll(em, Location.class).isEmpty()) {
            location = LocationResourceIT.createEntity(em);
            em.persist(location);
            em.flush();
        } else {
            location = TestUtil.findAll(em, Location.class).get(0);
        }
        section.setLocation(location);
        return section;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Section createUpdatedEntity(EntityManager em) {
        Section section = new Section().name(UPDATED_NAME);
        // Add required entity
        Location location;
        if (TestUtil.findAll(em, Location.class).isEmpty()) {
            location = LocationResourceIT.createUpdatedEntity(em);
            em.persist(location);
            em.flush();
        } else {
            location = TestUtil.findAll(em, Location.class).get(0);
        }
        section.setLocation(location);
        return section;
    }

    @BeforeEach
    void initTest() {
        section = createEntity(em);

        User user = UserResourceIT.createEntity(em);
        user.setLogin(TEST_USER_LOGIN);
        user.setAuthorities(Collections.singleton(authorityRepository.findById(AuthoritiesConstants.USER).get()));
        em.persist(user);

        invitation =
            InvitationResourceIT
                .createEntity(em)
                .accepted(Boolean.TRUE)
                .project(section.getLocation().getProject())
                .user(user)
                .role(roleRepository.roleContributor());

        em.flush();
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createSection() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        sectionRepository.deleteAll();

        // Create the Section
        restSectionMockMvc
            .perform(post("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(section)))
            .andExpect(status().isCreated());

        // Validate the Section in the database
        List<Section> sectionList = sectionRepository.findAll();
        assertThat(sectionList).hasSize(1);
        Section testSection = sectionList.get(0);
        assertThat(testSection.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createSectionWithExistingId() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        int databaseSizeBeforeCreate = sectionRepository.findAll().size();

        // Create the Section with an existing ID
        section.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSectionMockMvc
            .perform(post("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(section)))
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        List<Section> sectionList = sectionRepository.findAll();
        assertThat(sectionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createSectionForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSectionMockMvc
            .perform(post("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(section)))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = sectionRepository.findAll().size();
        // set the field null
        section.setName(null);

        // Create the Section, which fails.

        restSectionMockMvc
            .perform(post("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(section)))
            .andExpect(status().isBadRequest());

        List<Section> sectionList = sectionRepository.findAll();
        assertThat(sectionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(value = TEST_ADMIN_LOGIN, authorities = {AuthoritiesConstants.ADMIN})
    void getAllSections() throws Exception {
        // Initialize the database
        sectionRepository.saveAndFlush(section);

        // Get all the sectionList
        restSectionMockMvc
            .perform(get("/api/sections?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(section.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getAllSectionsForbiddenForAuthorityUser() throws Exception {
        // Initialize the database
        sectionRepository.saveAndFlush(section);

        // Get all the sectionList
        restSectionMockMvc.perform(get("/api/sections?sort=id,desc")).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getSection() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        // Initialize the database
        sectionRepository.saveAndFlush(section);

        // Get the section
        restSectionMockMvc
            .perform(get("/api/sections/{id}", section.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(section.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getNonExistingSection() throws Exception {
        // Get the section
        restSectionMockMvc.perform(get("/api/sections/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getSectionForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Get the section
        restSectionMockMvc.perform(get("/api/sections/{id}", section.getId())).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateSection() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        // Initialize the database
        sectionService.save(section);

        int databaseSizeBeforeUpdate = sectionRepository.findAll().size();

        // Update the section
        Section updatedSection = sectionRepository.findById(section.getId()).get();
        // Disconnect from session so that the updates on updatedSection are not directly saved in db
        em.detach(updatedSection);
        updatedSection.name(UPDATED_NAME);

        restSectionMockMvc
            .perform(
                put("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database
        List<Section> sectionList = sectionRepository.findAll();
        assertThat(sectionList).hasSize(databaseSizeBeforeUpdate);
        Section testSection = sectionList
            .stream()
            .filter(section -> updatedSection.getId().equals(section.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated section!"));
        assertThat(testSection.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateNonExistingSection() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        int databaseSizeBeforeUpdate = sectionRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(put("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(section)))
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        List<Section> sectionList = sectionRepository.findAll();
        assertThat(sectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateSectionForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Update the section
        Section updatedSection = createUpdatedEntity(em);

        restSectionMockMvc
            .perform(
                put("/api/sections").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedSection))
            )
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void deleteSection() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        // Initialize the database
        sectionService.save(section);

        int databaseSizeBeforeDelete = sectionRepository.findAll().size();

        // Delete the section
        restSectionMockMvc
            .perform(delete("/api/sections/{id}", section.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Section> sectionList = sectionRepository.findAll();
        assertThat(sectionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void deleteSectionForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Initialize the database
        sectionService.save(section);

        // Delete the section
        restSectionMockMvc
            .perform(delete("/api/sections/{id}", section.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void isNameExistingInProject() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        restSectionMockMvc
            .perform(
                post("/api/sections/location/{locationId}/name-exists", section.getLocation().getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(section.getName())
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(Boolean.FALSE));

        // Initialize the database
        sectionService.save(section);

        restSectionMockMvc
            .perform(
                post("/api/sections/location/{locationId}/name-exists", section.getLocation().getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(section.getName())
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(Boolean.TRUE));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void isNameExistingInProjectForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        restSectionMockMvc
            .perform(
                post("/api/sections/location/{locationId}/name-exists", section.getLocation().getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(section.getName())
            )
            .andExpect(status().isForbidden());
    }
}
