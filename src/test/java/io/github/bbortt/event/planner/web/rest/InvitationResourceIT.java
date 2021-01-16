package io.github.bbortt.event.planner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
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
import io.github.bbortt.event.planner.domain.Role;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.service.InvitationService;
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
 * Integration tests for the {@link InvitationResource} REST controller.
 */
class InvitationResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "invitationresourceit-login";
    private static final String TEST_USER_EMAIL = "invitationresourceit@login";
    private static final String TEST_ADMIN_LOGIN = "invitationresourceit-admin";
    private static final String TEST_ADMIN_EMAIL = "invitationresourceit@admin";

    private static final String DEFAULT_EMAIL = "default@event.planner";
    private static final String UPDATED_EMAIL = "update@event.planner";

    private static final Boolean DEFAULT_ACCEPTED = false;
    private static final Boolean UPDATED_ACCEPTED = true;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInvitationMockMvc;

    private User testUser;

    private Invitation invitation;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Invitation createEntity(EntityManager em) {
        Invitation invitation = new Invitation().email(DEFAULT_EMAIL).accepted(DEFAULT_ACCEPTED);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        invitation.setProject(project);
        // Add required entity
        Role role;
        if (TestUtil.findAll(em, Role.class).isEmpty()) {
            role = RoleResourceIT.createEntity(em);
            em.persist(role);
            em.flush();
        } else {
            // Role "ADMIN" @ index 0
            role = TestUtil.findAll(em, Role.class).get(1);
        }
        invitation.setRole(role);
        return invitation;
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Invitation createUpdatedEntity(EntityManager em) {
        Invitation invitation = new Invitation().email(UPDATED_EMAIL).accepted(UPDATED_ACCEPTED);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        invitation.setProject(project);
        // Add required entity
        Role role;
        if (TestUtil.findAll(em, Role.class).isEmpty()) {
            role = RoleResourceIT.createUpdatedEntity(em);
            em.persist(role);
            em.flush();
        } else {
            role = TestUtil.findAll(em, Role.class).get(0);
        }
        invitation.setRole(role);
        return invitation;
    }

    @BeforeEach
    void initTest() {
        invitation = createEntity(em);

        testUser = UserResourceIT.createEntity(em);
        testUser.setLogin(TEST_USER_LOGIN);
        testUser.setEmail(TEST_USER_EMAIL);
        invitation.user(testUser).email(TEST_USER_EMAIL);
        em.persist(testUser);

        User adminUser = UserResourceIT.createEntity(em);
        adminUser.setLogin(TEST_ADMIN_LOGIN);
        adminUser.setEmail(TEST_ADMIN_EMAIL);
        em.persist(adminUser);

        Invitation userInvitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(invitation.getProject())
            .user(adminUser)
            .email(TEST_ADMIN_EMAIL)
            .role(roleRepository.roleAdmin());
        em.persist(userInvitation);

        em.flush();
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void createInvitation() throws Exception {
        // Create the Invitation
        restInvitationMockMvc
            .perform(
                post("/api/invitations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invitation))
            )
            .andExpect(status().isCreated());

        // Validate the Invitation in the database
        Invitation testInvitation = invitationRepository
            .findOnyByEmailAndProjectId(invitation.getEmail(), invitation.getProject().getId())
            .orElseThrow(IllegalArgumentException::new);
        assertThat(testInvitation.getEmail()).isEqualTo(invitation.getEmail());
        assertThat(testInvitation.isAccepted()).isEqualTo(DEFAULT_ACCEPTED);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void cannotCreateADMINInvitation() throws Exception {
        invitation.setRole(roleRepository.roleAdmin());

        // Create the Invitation
        restInvitationMockMvc
            .perform(
                post("/api/invitations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invitation))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void createInvitationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = invitationRepository.findAll().size();

        // Create the Invitation with an existing ID
        invitation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restInvitationMockMvc
            .perform(
                post("/api/invitations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invitation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Invitation in the database
        List<Invitation> invitationList = invitationRepository.findAll();
        assertThat(invitationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = invitationRepository.findAll().size();
        // set the field null
        invitation.setEmail(null);

        // Create the Invitation, which fails.

        restInvitationMockMvc
            .perform(
                post("/api/invitations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invitation))
            )
            .andExpect(status().isBadRequest());

        List<Invitation> invitationList = invitationRepository.findAll();
        assertThat(invitationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void checkAcceptedIsRequired() throws Exception {
        int databaseSizeBeforeTest = invitationRepository.findAll().size();
        // set the field null
        invitation.setAccepted(null);

        // Create the Invitation, which fails.

        restInvitationMockMvc
            .perform(
                post("/api/invitations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invitation))
            )
            .andExpect(status().isBadRequest());

        List<Invitation> invitationList = invitationRepository.findAll();
        assertThat(invitationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(username = TEST_ADMIN_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void getAllInvitations() throws Exception {
        // Initialize the database
        invitationRepository.saveAndFlush(invitation);

        // Get all the invitationList
        restInvitationMockMvc
            .perform(get("/api/invitations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(invitation.getId().intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItems(TEST_USER_EMAIL, TEST_ADMIN_EMAIL)))
            .andExpect(jsonPath("$.[*].accepted").value(hasItem(DEFAULT_ACCEPTED.booleanValue())));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void getInvitation() throws Exception {
        // Initialize the database
        invitationRepository.saveAndFlush(invitation);

        // Get the invitation
        restInvitationMockMvc
            .perform(get("/api/invitations/{id}", invitation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(invitation.getId().intValue()))
            .andExpect(jsonPath("$.email").value(invitation.getEmail()))
            .andExpect(jsonPath("$.accepted").value(DEFAULT_ACCEPTED.booleanValue()));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void getNonExistingInvitation() throws Exception {
        // Get the invitation
        restInvitationMockMvc.perform(get("/api/invitations/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void updateInvitation() throws Exception {
        // Initialize the database
        invitationService.save(invitation);

        int databaseSizeBeforeUpdate = invitationRepository.findAll().size();

        // Update the invitation
        Invitation updatedInvitation = invitationRepository.findById(invitation.getId()).get();
        // Disconnect from session so that the updates on updatedInvitation are not directly saved in db
        em.detach(updatedInvitation);
        updatedInvitation.email(UPDATED_EMAIL).accepted(UPDATED_ACCEPTED);

        restInvitationMockMvc
            .perform(
                put("/api/invitations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInvitation))
            )
            .andExpect(status().isOk());

        // Validate the Invitation in the database
        List<Invitation> invitationList = invitationRepository.findAll();
        assertThat(invitationList).hasSize(databaseSizeBeforeUpdate);
        Invitation testInvitation = invitationList
            .stream()
            .filter(invitation -> updatedInvitation.getId().equals(invitation.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated invitation!"));
        assertThat(testInvitation.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testInvitation.isAccepted()).isEqualTo(UPDATED_ACCEPTED);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void updateNonExistingInvitation() throws Exception {
        int databaseSizeBeforeUpdate = invitationRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInvitationMockMvc
            .perform(put("/api/invitations").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invitation)))
            .andExpect(status().isBadRequest());

        // Validate the Invitation in the database
        List<Invitation> invitationList = invitationRepository.findAll();
        assertThat(invitationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_ADMIN_LOGIN)
    void deleteInvitation() throws Exception {
        // Initialize the database
        invitationService.save(invitation);

        int databaseSizeBeforeDelete = invitationRepository.findAll().size();

        // Delete the invitation
        restInvitationMockMvc
            .perform(delete("/api/invitations/{id}", invitation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Invitation> invitationList = invitationRepository.findAll();
        assertThat(invitationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    void acceptInvitationWithoutCurrentUser() throws Exception {
        restInvitationMockMvc
            .perform(post("/api/invitations/accept").content("a0d5206e-4a3f-49f9-b92d-8bf7bcd5a9ab"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void acceptInvitationForCurrentUser() throws Exception {
        final String token = "810b88eb-4d1b-430b-905c-ad5a387bca3b";

        invitation.token(token);
        em.persist(invitation);

        restInvitationMockMvc.perform(post("/api/invitations/accept").content(token)).andExpect(status().isOk());

        em.refresh(invitation);

        assertThat(invitation).hasFieldOrPropertyWithValue("token", null);
        assertThat(invitation).hasFieldOrPropertyWithValue("accepted", Boolean.TRUE);
    }

    @Test
    @Transactional
    void acceptInvitationRightAfterRegistration() throws Exception {
        final String token = "78024294-baf7-414f-9b12-d86c9983a71d";

        invitation.token(token);
        em.persist(invitation);

        restInvitationMockMvc.perform(post("/api/invitations/accept/" + testUser.getLogin()).content(token)).andExpect(status().isOk());

        em.refresh(invitation);

        assertThat(invitation).hasFieldOrPropertyWithValue("token", null);
        assertThat(invitation).hasFieldOrPropertyWithValue("accepted", Boolean.TRUE);
    }

    @Test
    @Transactional
    void acceptInvitationRightAfterRegistrationWithInvalidUsername() throws Exception {
        final String token = "78024294-baf7-414f-9b12-d86c9983a71d";

        invitation.token(token);
        em.persist(invitation);

        restInvitationMockMvc
            .perform(post("/api/invitations/accept/InvalidLoginName").content(token))
            .andExpect(status().isInternalServerError());
    }
}
