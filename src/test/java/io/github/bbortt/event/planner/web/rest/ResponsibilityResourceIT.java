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

import io.github.bbortt.event.planner.EventPlannerApp;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.repository.ResponsibilityRepository;
import io.github.bbortt.event.planner.service.ResponsibilityService;
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
 * Integration tests for the {@link ResponsibilityResource} REST controller.
 */
@SpringBootTest(classes = EventPlannerApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ResponsibilityResourceIT {
    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private ResponsibilityRepository responsibilityRepository;

    @Autowired
    private ResponsibilityService responsibilityService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResponsibilityMockMvc;

    private Responsibility responsibility;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Responsibility createEntity(EntityManager em) {
        Responsibility responsibility = new Responsibility().name(DEFAULT_NAME);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        responsibility.setProject(project);
        return responsibility;
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Responsibility createUpdatedEntity(EntityManager em) {
        Responsibility responsibility = new Responsibility().name(UPDATED_NAME);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        responsibility.setProject(project);
        return responsibility;
    }

    @BeforeEach
    public void initTest() {
        responsibility = createEntity(em);
    }

    @Test
    @Transactional
    public void createResponsibility() throws Exception {
        int databaseSizeBeforeCreate = responsibilityRepository.findAll().size();
        // Create the Responsibility
        restResponsibilityMockMvc
            .perform(
                post("/api/responsibilities")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(responsibility))
            )
            .andExpect(status().isCreated());

        // Validate the Responsibility in the database
        List<Responsibility> responsibilityList = responsibilityRepository.findAll();
        assertThat(responsibilityList).hasSize(databaseSizeBeforeCreate + 1);
        Responsibility testResponsibility = responsibilityList.get(responsibilityList.size() - 1);
        assertThat(testResponsibility.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createResponsibilityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = responsibilityRepository.findAll().size();

        // Create the Responsibility with an existing ID
        responsibility.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResponsibilityMockMvc
            .perform(
                post("/api/responsibilities")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(responsibility))
            )
            .andExpect(status().isBadRequest());

        // Validate the Responsibility in the database
        List<Responsibility> responsibilityList = responsibilityRepository.findAll();
        assertThat(responsibilityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = responsibilityRepository.findAll().size();
        // set the field null
        responsibility.setName(null);

        // Create the Responsibility, which fails.

        restResponsibilityMockMvc
            .perform(
                post("/api/responsibilities")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(responsibility))
            )
            .andExpect(status().isBadRequest());

        List<Responsibility> responsibilityList = responsibilityRepository.findAll();
        assertThat(responsibilityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllResponsibilities() throws Exception {
        // Initialize the database
        responsibilityRepository.saveAndFlush(responsibility);

        // Get all the responsibilityList
        restResponsibilityMockMvc
            .perform(get("/api/responsibilities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(responsibility.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void getResponsibility() throws Exception {
        // Initialize the database
        responsibilityRepository.saveAndFlush(responsibility);

        // Get the responsibility
        restResponsibilityMockMvc
            .perform(get("/api/responsibilities/{id}", responsibility.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(responsibility.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    public void getNonExistingResponsibility() throws Exception {
        // Get the responsibility
        restResponsibilityMockMvc.perform(get("/api/responsibilities/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResponsibility() throws Exception {
        // Initialize the database
        responsibilityService.save(responsibility);

        int databaseSizeBeforeUpdate = responsibilityRepository.findAll().size();

        // Update the responsibility
        Responsibility updatedResponsibility = responsibilityRepository.findById(responsibility.getId()).get();
        // Disconnect from session so that the updates on updatedResponsibility are not directly saved in db
        em.detach(updatedResponsibility);
        updatedResponsibility.name(UPDATED_NAME);

        restResponsibilityMockMvc
            .perform(
                put("/api/responsibilities")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResponsibility))
            )
            .andExpect(status().isOk());

        // Validate the Responsibility in the database
        List<Responsibility> responsibilityList = responsibilityRepository.findAll();
        assertThat(responsibilityList).hasSize(databaseSizeBeforeUpdate);
        Responsibility testResponsibility = responsibilityList.get(responsibilityList.size() - 1);
        assertThat(testResponsibility.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingResponsibility() throws Exception {
        int databaseSizeBeforeUpdate = responsibilityRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResponsibilityMockMvc
            .perform(
                put("/api/responsibilities")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(responsibility))
            )
            .andExpect(status().isBadRequest());

        // Validate the Responsibility in the database
        List<Responsibility> responsibilityList = responsibilityRepository.findAll();
        assertThat(responsibilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResponsibility() throws Exception {
        // Initialize the database
        responsibilityService.save(responsibility);

        int databaseSizeBeforeDelete = responsibilityRepository.findAll().size();

        // Delete the responsibility
        restResponsibilityMockMvc
            .perform(delete("/api/responsibilities/{id}", responsibility.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Responsibility> responsibilityList = responsibilityRepository.findAll();
        assertThat(responsibilityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
