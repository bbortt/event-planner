package io.github.bbortt.event.planner.web.rest;

import static io.github.bbortt.event.planner.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
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
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.AuthorityRepository;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.dto.CreateProjectDTO;
import io.github.bbortt.event.planner.service.dto.UserDTO;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link ProjectResource} REST controller.
 */
class ProjectResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "projectresourceit-login";
    private static final String TEST_ADMIN_LOGIN = "projectresourceit-admin";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectMockMvc;

    private User user;
    private Project project;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Project createEntity(EntityManager em) {
        Project project = new Project()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME);
        return project;
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Project createUpdatedEntity(EntityManager em) {
        Project project = new Project()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);
        return project;
    }

    @BeforeEach
    void initTest() {
        project = createEntity(em);

        user = UserResourceIT.createEntity(em);
        user.setLogin(TEST_USER_LOGIN);
        user.setAuthorities(Collections.singleton(authorityRepository.findById(AuthoritiesConstants.USER).get()));
        em.persist(user);

        em.flush();
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void createProject() throws Exception {
        projectRepository.deleteAll();

        User user = userRepository.save(UserResourceIT.createEntity(em));

        // Create the Project
        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setName(project.getName());
        createProjectDTO.setDescription(project.getDescription());
        createProjectDTO.setStartTime(project.getStartTime());
        createProjectDTO.setEndTime(project.getEndTime());

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        createProjectDTO.setUser(userDTO);

        restProjectMockMvc
            .perform(
                post("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(createProjectDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Project in the database
        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(1);
        Project testProject = projectList.get(0);
        assertThat(testProject.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProject.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProject.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testProject.getEndTime()).isEqualTo(DEFAULT_END_TIME);

        assertThat(invitationRepository.findAll())
            .hasSize(1)
            .first()
            .hasFieldOrPropertyWithValue("project", testProject)
            .hasFieldOrPropertyWithValue("role", roleRepository.roleAdmin());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectRepository.findAll().size();
        // set the field null
        project.setName(null);

        // Create the Project, which fails.

        restProjectMockMvc
            .perform(post("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(project)))
            .andExpect(status().isBadRequest());

        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectRepository.findAll().size();
        // set the field null
        project.setStartTime(null);

        // Create the Project, which fails.

        restProjectMockMvc
            .perform(post("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(project)))
            .andExpect(status().isBadRequest());

        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectRepository.findAll().size();
        // set the field null
        project.setEndTime(null);

        // Create the Project, which fails.

        restProjectMockMvc
            .perform(post("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(project)))
            .andExpect(status().isBadRequest());

        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getProject() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .user(user)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

        // Get the project
        restProjectMockMvc
            .perform(get("/api/projects/{id}", project.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(project.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startTime").value(sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getNonExistingProject() throws Exception {
        // Get the project
        restProjectMockMvc.perform(get("/api/projects/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateProject() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .user(user)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

        int databaseSizeBeforeUpdate = projectRepository.findAll().size();

        // Update the project
        Project updatedProject = projectRepository.findById(project.getId()).get();
        // Disconnect from session so that the updates on updatedProject are not directly saved in db
        em.detach(updatedProject);
        updatedProject.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restProjectMockMvc
            .perform(
                put("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedProject))
            )
            .andExpect(status().isOk());

        // Validate the Project in the database
        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeUpdate);
        Project testProject = projectList
            .stream()
            .filter(project -> updatedProject.getId().equals(project.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated project!"));
        assertThat(testProject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProject.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProject.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testProject.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateNonExistingProject() throws Exception {
        int databaseSizeBeforeUpdate = projectRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectMockMvc
            .perform(put("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(project)))
            .andExpect(status().isBadRequest());

        // Validate the Project in the database
        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(username = TEST_ADMIN_LOGIN, roles = { RolesConstants.ADMIN })
    void archiveProject() throws Exception {
        // Initialize the database
        projectService.save(project);

        int databaseSizeBeforeArchive = projectRepository.findAll().size();

        // Disconnect from session
        em.detach(project);

        // Delete the project
        restProjectMockMvc
            .perform(put("/api/projects/{id}/archive", project.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the Project in the database
        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeArchive);
        Project archivedProject = projectList
            .stream()
            .filter(testProject -> testProject.getId().equals(project.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated project!"));
        assertThat(archivedProject.isArchived()).isTrue();
    }

    @Test
    @Transactional
    @WithMockUser(username = TEST_ADMIN_LOGIN, roles = { RolesConstants.ADMIN })
    void deleteProject() throws Exception {
        // Initialize the database
        projectService.save(project);

        int databaseSizeBeforeDelete = projectRepository.findAll().size();

        // Delete the project
        restProjectMockMvc
            .perform(delete("/api/projects/{id}", project.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Project> projectList = projectRepository.findAll();
        assertThat(projectList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void deleteProjectDeniedForUsers() throws Exception {
        // Initialize the database
        projectService.save(project);

        // Delete the project
        restProjectMockMvc.perform(delete("/api/projects/{id}", project.getId())).andExpect(status().isForbidden());
    }
}
