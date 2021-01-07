package io.github.bbortt.event.planner.web.rest;

import static io.github.bbortt.event.planner.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.EventPlannerApp;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.LocationTimeSlot;
import io.github.bbortt.event.planner.repository.LocationTimeSlotRepository;
import io.github.bbortt.event.planner.service.LocationTimeSlotService;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LocationTimeSlotResource} REST controller.
 */
@SpringBootTest(classes = EventPlannerApp.class)
@AutoConfigureMockMvc
@WithMockUser
class LocationTimeSlotResourceIT {

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private LocationTimeSlotRepository locationTimeSlotRepository;

    @Autowired
    private LocationTimeSlotService locationTimeSlotService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLocationTimeSlotMockMvc;

    private LocationTimeSlot locationTimeSlot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
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
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
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
        locationTimeSlot = createEntity(em);
    }

    @Test
    @Transactional
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
    void getAllLocationTimeSlots() throws Exception {
        // Initialize the database
        locationTimeSlotRepository.saveAndFlush(locationTimeSlot);

        // Get all the locationTimeSlotList
        restLocationTimeSlotMockMvc
            .perform(get("/api/location-time-slots?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(locationTimeSlot.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(sameInstant(DEFAULT_END_TIME))));
    }

    @Test
    @Transactional
    void getLocationTimeSlot() throws Exception {
        // Initialize the database
        locationTimeSlotRepository.saveAndFlush(locationTimeSlot);

        // Get the locationTimeSlot
        restLocationTimeSlotMockMvc
            .perform(get("/api/location-time-slots/{id}", locationTimeSlot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(locationTimeSlot.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingLocationTimeSlot() throws Exception {
        // Get the locationTimeSlot
        restLocationTimeSlotMockMvc.perform(get("/api/location-time-slots/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void updateLocationTimeSlot() throws Exception {
        // Initialize the database
        locationTimeSlotService.save(locationTimeSlot);

        int databaseSizeBeforeUpdate = locationTimeSlotRepository.findAll().size();

        // Update the locationTimeSlot
        LocationTimeSlot updatedLocationTimeSlot = locationTimeSlotRepository.findById(locationTimeSlot.getId()).get();
        // Disconnect from session so that the updates on updatedLocationTimeSlot are not directly saved in db
        em.detach(updatedLocationTimeSlot);
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
