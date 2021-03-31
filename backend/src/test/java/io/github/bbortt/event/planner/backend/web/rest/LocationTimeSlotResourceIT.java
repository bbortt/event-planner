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
import io.github.bbortt.event.planner.backend.domain.LocationTimeSlot;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.repository.LocationTimeSlotRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.LocationTimeSlotService;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import javax.persistence.EntityManager;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LocationTimeSlotResource} REST controller.
 */
class LocationTimeSlotResourceIT extends AbstractApplicationContextAwareIT {

    static final String TEST_USER_LOGIN = "schedulerresourceit-user";

    static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    LocationTimeSlotRepository locationTimeSlotRepository;

    @Autowired
    LocationTimeSlotService locationTimeSlotService;

    @Autowired
    MockMvc restLocationTimeSlotMockMvc;

    @Autowired
    EntityManager entityManager;

    LocationTimeSlot locationTimeSlot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static LocationTimeSlot createEntity(EntityManager em) {
        LocationTimeSlot locationTimeSlot = new LocationTimeSlot().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME);
        // Add required entity
        Location location;
        if (TestUtil.findAll(em, Location.class).isEmpty()) {
            location = LocationResourceIT.createEntity(em);
            em.persist(location);
            em.flush();
        } else {
            location = TestUtil.findAll(em, Location.class).get(0);
        }
        locationTimeSlot.setLocation(location);
        return locationTimeSlot;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static LocationTimeSlot createUpdatedEntity(EntityManager em) {
        LocationTimeSlot locationTimeSlot = new LocationTimeSlot().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);
        // Add required entity
        Location location;
        if (TestUtil.findAll(em, Location.class).isEmpty()) {
            location = LocationResourceIT.createUpdatedEntity(em);
            em.persist(location);
            em.flush();
        } else {
            location = TestUtil.findAll(em, Location.class).get(0);
        }
        locationTimeSlot.setLocation(location);
        return locationTimeSlot;
    }

    @BeforeEach
    void initTest() {
        User user = UserResourceIT.createEntity(entityManager);
        user.setId(TEST_USER_LOGIN);
        user.setLogin(TEST_USER_LOGIN);
        user.setEmail(TEST_USER_LOGIN + "@localhost");
        entityManager.persist(user);

        Project project = ProjectResourceIT.createEntity(entityManager);
        project.setName("RoleRepositoryIT-project-1");
        entityManager.persist(project);

        Invitation invitation = InvitationResourceIT.createEntity(entityManager);
        invitation.setUser(user);
        invitation.setEmail("email-invitation-1@localhost");
        invitation.setProject(project);
        invitation.setRole(roleRepository.roleAdmin());
        invitation.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation);

        locationTimeSlot = createEntity(entityManager);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createLocationTimeSlot() throws Exception {
        int databaseSizeBeforeCreate = locationTimeSlotRepository.findAll().size();
        // Create the LocationTimeSlot
        restLocationTimeSlotMockMvc
            .perform(
                post("/api/location-time-slots")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(locationTimeSlot))
            )
            .andExpect(status().isCreated());

        // Validate the LocationTimeSlot in the database
        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeCreate + 1);
        LocationTimeSlot testLocationTimeSlot = locationTimeSlotList.get(locationTimeSlotList.size() - 1);
        assertThat(testLocationTimeSlot.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testLocationTimeSlot.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createLocationTimeSlotWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = locationTimeSlotRepository.findAll().size();

        // Create the LocationTimeSlot with an existing ID
        locationTimeSlot.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLocationTimeSlotMockMvc
            .perform(
                post("/api/location-time-slots")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(locationTimeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the LocationTimeSlot in the database
        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationTimeSlotRepository.findAll().size();
        // set the field null
        locationTimeSlot.setStartTime(null);

        // Create the LocationTimeSlot, which fails.

        restLocationTimeSlotMockMvc
            .perform(
                post("/api/location-time-slots")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(locationTimeSlot))
            )
            .andExpect(status().isBadRequest());

        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationTimeSlotRepository.findAll().size();
        // set the field null
        locationTimeSlot.setEndTime(null);

        // Create the LocationTimeSlot, which fails.

        restLocationTimeSlotMockMvc
            .perform(
                post("/api/location-time-slots")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(locationTimeSlot))
            )
            .andExpect(status().isBadRequest());

        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(value = TEST_USER_LOGIN, authorities = { AuthoritiesConstants.ADMIN })
    void getAllLocationTimeSlots() throws Exception {
        // Initialize the database
        locationTimeSlotRepository.saveAndFlush(locationTimeSlot);

        // Get all the locationTimeSlotList
        restLocationTimeSlotMockMvc
            .perform(get("/api/location-time-slots?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(locationTimeSlot.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_END_TIME))));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getAllLocationTimeSlotsForbiddenForUsers() throws Exception {
        // Initialize the database
        locationTimeSlotRepository.saveAndFlush(locationTimeSlot);

        // Get all the sectionList
        restLocationTimeSlotMockMvc.perform(get("/api/location-time-slots?sort=id,desc")).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getLocationTimeSlot() throws Exception {
        // Initialize the database
        locationTimeSlotRepository.saveAndFlush(locationTimeSlot);

        // Get the locationTimeSlot
        restLocationTimeSlotMockMvc
            .perform(get("/api/location-time-slots/{id}", locationTimeSlot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(locationTimeSlot.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(TestUtil.sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(TestUtil.sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getNonExistingLocationTimeSlot() throws Exception {
        // Get the locationTimeSlot
        restLocationTimeSlotMockMvc.perform(get("/api/location-time-slots/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateLocationTimeSlot() throws Exception {
        // Initialize the database
        locationTimeSlotService.save(locationTimeSlot);

        int databaseSizeBeforeUpdate = locationTimeSlotRepository.findAll().size();

        // Update the locationTimeSlot
        LocationTimeSlot updatedLocationTimeSlot = locationTimeSlotRepository.findById(locationTimeSlot.getId()).get();
        // Disconnect from session so that the updates on updatedLocationTimeSlot are not directly saved in db
        entityManager.detach(updatedLocationTimeSlot);
        updatedLocationTimeSlot.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restLocationTimeSlotMockMvc
            .perform(
                put("/api/location-time-slots")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLocationTimeSlot))
            )
            .andExpect(status().isOk());

        // Validate the LocationTimeSlot in the database
        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeUpdate);
        LocationTimeSlot testLocationTimeSlot = locationTimeSlotList.get(locationTimeSlotList.size() - 1);
        assertThat(testLocationTimeSlot.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testLocationTimeSlot.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateNonExistingLocationTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = locationTimeSlotRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocationTimeSlotMockMvc
            .perform(
                put("/api/location-time-slots")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(locationTimeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the LocationTimeSlot in the database
        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void deleteLocationTimeSlot() throws Exception {
        // Initialize the database
        locationTimeSlotService.save(locationTimeSlot);

        int databaseSizeBeforeDelete = locationTimeSlotRepository.findAll().size();

        // Delete the locationTimeSlot
        restLocationTimeSlotMockMvc
            .perform(delete("/api/location-time-slots/{id}", locationTimeSlot.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LocationTimeSlot> locationTimeSlotList = locationTimeSlotRepository.findAll();
        assertThat(locationTimeSlotList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
