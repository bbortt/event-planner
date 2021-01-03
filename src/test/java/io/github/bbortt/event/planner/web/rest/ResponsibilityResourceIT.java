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
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.AuthorityRepository;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.repository.ResponsibilityRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.service.ResponsibilityService;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ResponsibilityResource} REST controller.
 */
@WithMockUser
public class ResponsibilityResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "responsibilityresourceit-login";
    private static final String TEST_ADMIN_LOGIN = "responsibilityresourceit-admin";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private ResponsibilityRepository responsibilityRepository;

    @Autowired
    private ResponsibilityService responsibilityService;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResponsibilityMockMvc;

    private Responsibility responsibility;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create an entity for this test.
     *
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
     *
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

        User user = UserResourceIT.createEntity(em);
        user.setLogin(TEST_USER_LOGIN);
        user.setAuthorities(Collections.singleton(authorityRepository.findById(AuthoritiesConstants.USER).get()));
        em.persist(user);

        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(responsibility.getProject())
            .user(user)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

        em.flush();
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    public void createResponsibility() throws Exception {
        responsibilityRepository.deleteAll();

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
        assertThat(responsibilityList).hasSize(1);
        Responsibility testResponsibility = responsibilityList.get(0);
        assertThat(testResponsibility.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
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
    @WithMockUser(value = TEST_ADMIN_LOGIN, roles = { RolesConstants.ADMIN })
    public void getAllResponsibilitiesIsForAdminsOnly() throws Exception {
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
    @WithMockUser(TEST_USER_LOGIN)
    public void getAllResponsibilitiesDeniedForUsers() throws Exception {
        // Initialize the database
        responsibilityRepository.saveAndFlush(responsibility);

        // Get all the responsibilityList
        restResponsibilityMockMvc.perform(get("/api/responsibilities?sort=id,desc")).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
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
    @WithMockUser(TEST_USER_LOGIN)
    public void getNonExistingResponsibility() throws Exception {
        // Get the responsibility
        restResponsibilityMockMvc.perform(get("/api/responsibilities/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
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
        Responsibility testResponsibility = responsibilityList
            .stream()
            .filter(responsibility -> updatedResponsibility.getId().equals(responsibility.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated responsibility!"));
        assertThat(testResponsibility.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
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
    @WithMockUser(TEST_USER_LOGIN)
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

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    public void getResponsibilitiesPerProject() throws Exception {
        // Test data
        final String responsibility2Name = "Responsibility1";
        final String responsibility3Name = "Responsibility2";

        // Initialize the database
        Project project1 = projectRepository.saveAndFlush(ProjectResourceIT.createEntity(em));
        Project project2 = projectRepository.saveAndFlush(ProjectResourceIT.createEntity(em));

        User user = userRepository
            .findOneByLogin(TEST_USER_LOGIN)
            .orElseThrow(() -> new EntityNotFoundException("User with login " + TEST_USER_LOGIN + " not found"));
        em.persist(
            InvitationResourceIT.createEntity(em).accepted(Boolean.TRUE).project(project1).user(user).role(roleRepository.roleAdmin())
        );
        em.persist(
            InvitationResourceIT.createEntity(em).accepted(Boolean.TRUE).project(project2).user(user).role(roleRepository.roleAdmin())
        );
        em.flush();

        responsibilityRepository.saveAndFlush(ResponsibilityResourceIT.createEntity(em).project(project1));
        Responsibility responsibility2 = responsibilityRepository.saveAndFlush(
            ResponsibilityResourceIT.createEntity(em).name(responsibility2Name).project(project2)
        );
        Responsibility responsibility3 = responsibilityRepository.saveAndFlush(
            ResponsibilityResourceIT.createEntity(em).name(responsibility3Name).project(project2)
        );

        // Get the project
        restResponsibilityMockMvc
            .perform(get("/api/responsibilities/project/{projectId}", project2.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].id").value(responsibility2.getId()))
            .andExpect(jsonPath("$[0].name").value(responsibility2.getName()))
            .andExpect(jsonPath("$[1].id").value(responsibility3.getId()))
            .andExpect(jsonPath("$[1].name").value(responsibility3.getName()));
    }
}
