package io.github.bbortt.event.planner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.AuthorityRepository;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.service.LocationService;
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
 * Integration tests for the {@link LocationResource} REST controller.
 */
class LocationResourceIT extends AbstractApplicationContextAwareIT {
    private static final String TEST_USER_LOGIN = "locationresourceit-login";
    private static final String TEST_ADMIN_LOGIN = "locationresourceit-admin";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private LocationService locationService;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLocationMockMvc;

    private User user;
    private Location location;
    private Invitation invitation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Location createEntity(EntityManager em) {
        Location location = new Location().name(DEFAULT_NAME);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        location.setProject(project);
        return location;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Location createUpdatedEntity(EntityManager em) {
        Location location = new Location().name(UPDATED_NAME);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        location.setProject(project);
        return location;
    }

    @BeforeEach
    void initTest() {
        location = createEntity(em);

        user = UserResourceIT.createEntity(em);
        user.setLogin(TEST_USER_LOGIN);
        user.setAuthorities(Collections.singleton(authorityRepository.findById(AuthoritiesConstants.USER).get()));
        em.persist(user);

        invitation =
            InvitationResourceIT
                .createEntity(em)
                .accepted(Boolean.TRUE)
                .project(location.getProject())
                .user(user)
                .role(roleRepository.roleContributor());

        em.flush();
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createLocation() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        locationRepository.deleteAll();

        // Create the Location
        restLocationMockMvc
            .perform(post("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(location)))
            .andExpect(status().isCreated());

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll();
        assertThat(locationList).hasSize(1);
        Location testLocation = locationList.get(0);
        assertThat(testLocation.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createLocationWithExistingId() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        int databaseSizeBeforeCreate = locationRepository.findAll().size();

        // Create the Location with an existing ID
        location.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLocationMockMvc
            .perform(post("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(location)))
            .andExpect(status().isBadRequest());

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll();
        assertThat(locationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createLocationForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Create the Location
        restLocationMockMvc
            .perform(post("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(location)))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationRepository.findAll().size();
        // set the field null
        location.setName(null);

        // Create the Location, which fails.

        restLocationMockMvc
            .perform(post("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(location)))
            .andExpect(status().isBadRequest());

        List<Location> locationList = locationRepository.findAll();
        assertThat(locationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(value = TEST_ADMIN_LOGIN, authorities = {AuthoritiesConstants.ADMIN})
    void getAllLocations() throws Exception {
        // Initialize the database
        locationRepository.saveAndFlush(location);

        // Get all the sectionList
        restLocationMockMvc
            .perform(get("/api/locations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(location.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getAllLocationsForbiddenForUsers() throws Exception {
        // Initialize the database
        locationRepository.saveAndFlush(location);

        // Get all the locationList
        restLocationMockMvc.perform(get("/api/locations?sort=id,desc")).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getLocation() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        // Initialize the database
        locationRepository.saveAndFlush(location);

        // Get the location
        restLocationMockMvc
            .perform(get("/api/locations/{id}", location.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(location.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getLocationForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Get the location
        restLocationMockMvc.perform(get("/api/locations/{id}", location.getId())).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getLocationsByProjectIdDoesSortIgnoreCase() throws Exception {
        // Initialize the database
        locationRepository.saveAndFlush(location);

        Project project = ProjectResourceIT.createEntity(em);
        em.persist(project);

        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .user(user)
            .role(roleRepository.roleContributor());
        em.persist(invitation);

        Location projectLocation1 = new Location().name("A").project(project);
        locationRepository.saveAndFlush(projectLocation1);
        Location projectLocation2 = new Location().name("b").project(project);
        locationRepository.saveAndFlush(projectLocation2);
        Location projectLocation3 = new Location().name("C").project(project);
        locationRepository.saveAndFlush(projectLocation3);

        // Get the locations by project ID
        restLocationMockMvc
            .perform(get("/api/locations/project/{projectId}?sort=name,asc", project.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$[0].name").value(projectLocation1.getName()))
            .andExpect(jsonPath("$[1].name").value(projectLocation2.getName()))
            .andExpect(jsonPath("$[2].name").value(projectLocation3.getName()));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getNonExistingLocation() throws Exception {
        // Get the location
        restLocationMockMvc.perform(get("/api/locations/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateLocation() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        // Initialize the database
        locationService.save(location);

        int databaseSizeBeforeUpdate = locationRepository.findAll().size();

        // Update the location
        Location updatedLocation = locationRepository.findById(location.getId()).get();
        // Disconnect from session so that the updates on updatedLocation are not directly saved in db
        em.detach(updatedLocation);
        updatedLocation.name(UPDATED_NAME);

        restLocationMockMvc
            .perform(
                put("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedLocation))
            )
            .andExpect(status().isOk());

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
        Location testLocation = locationList
            .stream()
            .filter(location -> updatedLocation.getId().equals(location.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated location!"));
        assertThat(testLocation.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateNonExistingLocation() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        int databaseSizeBeforeUpdate = locationRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocationMockMvc
            .perform(put("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(location)))
            .andExpect(status().isBadRequest());

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateLocationForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Update the location
        Location updatedLocation = createUpdatedEntity(em);

        restLocationMockMvc
            .perform(
                put("/api/locations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedLocation))
            )
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void deleteLocation() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        // Initialize the database
        locationService.save(location);

        int databaseSizeBeforeDelete = locationRepository.findAll().size();

        // Delete the location
        restLocationMockMvc
            .perform(delete("/api/locations/{id}", location.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Location> locationList = locationRepository.findAll();
        assertThat(locationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void deleteLocationForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        // Initialize the database
        locationService.save(location);

        // Delete the location
        restLocationMockMvc
            .perform(delete("/api/locations/{id}", location.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void isNameExistingInProject() throws Exception {
        em.persist(invitation.role(roleRepository.roleAdmin()));

        restLocationMockMvc
            .perform(
                post("/api/locations/project/{projectId}/name-exists", location.getProject().getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(location.getName())
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(Boolean.FALSE));

        // Initialize the database
        locationService.save(location);

        restLocationMockMvc
            .perform(
                post("/api/locations/project/{projectId}/name-exists", location.getProject().getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(location.getName())
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(Boolean.TRUE));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void isNameExistingInProjectForbiddenForRoleContributor() throws Exception {
        em.persist(invitation);

        restLocationMockMvc
            .perform(
                post("/api/locations/project/{projectId}/name-exists", location.getProject().getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(location.getName())
            )
            .andExpect(status().isForbidden());
    }
}
