package io.github.bbortt.event.planner.backend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import io.github.bbortt.event.planner.backend.repository.ProjectRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.ProjectService;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProjectResource} REST controller.
 */
public class ProjectResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "projectresourceit-login";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.of(2020, 6, 24, 20, 0, 0, 0, ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.of(2021, 6, 24, 20, 0, 0, 0, ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.of(2020, 6, 25, 20, 0, 0, 0, ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.of(2021, 6, 25, 20, 0, 0, 0, ZoneId.systemDefault());

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

    private Map<String, Object> userDetails;
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
        userDetails = new HashMap<>();
        userDetails.put("sub", TEST_USER_LOGIN);
        userDetails.put("email", TEST_USER_LOGIN + "@localhost");
        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        project = createEntity(em);
        em.flush();
    }

    @Test
    @Transactional
    void createProject() throws Exception {
        projectRepository.deleteAll();

        // Create the Project
        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setName(project.getName());
        createProjectDTO.setDescription(project.getDescription());
        createProjectDTO.setStartTime(project.getStartTime());
        createProjectDTO.setEndTime(project.getEndTime());
        createProjectDTO.setUserInformation(null);

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
    void getProject() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation);

        // Get the project
        restProjectMockMvc
            .perform(get("/api/projects/{id}", project.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(project.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startTime").value(TestUtil.sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(TestUtil.sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    void getMyProject() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation);

        // Get the project
        restProjectMockMvc
            .perform(get("/api/projects"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].id").value(project.getId().intValue()));
    }

    @Test
    @Transactional
    void getAllProjects() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Initialize the database
        projectRepository.saveAndFlush(createEntity(em));
        projectRepository.saveAndFlush(createUpdatedEntity(em));

        // Get the project
        restProjectMockMvc
            .perform(get("/api/projects?loadAll=true"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @Transactional
    void getArchivedProjects() throws Exception {
        // Initialize the database
        Project archivedProject = createEntity(em).archived(Boolean.TRUE);
        projectRepository.saveAndFlush(archivedProject);
        Invitation invitation1 = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(archivedProject)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation1);

        Project activeProject = createUpdatedEntity(em);
        projectRepository.saveAndFlush(activeProject);
        Invitation invitation2 = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(activeProject)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation2);

        // Get the project
        restProjectMockMvc
            .perform(get("/api/projects?loadArchived=true"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].id").value(archivedProject.getId().intValue()));
    }

    @Test
    @Transactional
    void getAllArchivedProjects() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Initialize the database
        projectRepository.saveAndFlush(createEntity(em).archived(Boolean.TRUE));
        projectRepository.saveAndFlush(createUpdatedEntity(em).archived(Boolean.TRUE));

        // Get the project
        restProjectMockMvc
            .perform(get("/api/projects?loadAll=true&loadArchived=true"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @Transactional
    void getNonExistingProject() throws Exception {
        // Get the project
        restProjectMockMvc.perform(get("/api/projects/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void updateProject() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

        int databaseSizeBeforeUpdate = projectRepository.findAll().size();

        // Update the project
        Project updatedProject = projectRepository.findById(project.getId()).orElseThrow(IllegalArgumentException::new);
        // Disconnect from session so that the updates on updatedProject are not directly saved in db
        em.detach(updatedProject);
        updatedProject.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

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
        assertThat(testProject.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testProject.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void cannotUpdateProjectTimes() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

        int databaseSizeBeforeUpdate = projectRepository.findAll().size();

        // Update the project
        Project updatedProject = projectRepository.findById(project.getId()).orElseThrow(IllegalArgumentException::new);
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
        assertThat(testProject.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testProject.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void updateNonExistingProject() throws Exception {
        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectMockMvc
            .perform(put("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(project)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void updateProjectForbiddenForContributors() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation);

        Project updatedProject = project.name(UPDATED_NAME);

        restProjectMockMvc
            .perform(
                put("/api/projects").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedProject))
            )
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    void archiveProject() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

        int databaseSizeBeforeArchive = projectRepository.findAll().size();

        // Delete the project
        restProjectMockMvc
            .perform(put("/api/projects/{id}/archive", project.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        em.refresh(project);
        assertThat(project.isArchived()).isTrue();
    }

    @Test
    @Transactional
    void archiveProjectForbiddenForRoleSecretary() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleSecretary());
        em.persist(invitation);

        // Disconnect from session
        em.detach(project);

        // Delete the project
        restProjectMockMvc
            .perform(put("/api/projects/{id}/archive", project.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    void deleteProject() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleAdmin());
        em.persist(invitation);

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
    void deleteProjectForbiddenForRoleSecretary() throws Exception {
        // Initialize the database
        projectService.save(project);
        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleSecretary());
        em.persist(invitation);

        // Delete the project
        restProjectMockMvc.perform(delete("/api/projects/{id}", project.getId())).andExpect(status().isForbidden());
    }
}
