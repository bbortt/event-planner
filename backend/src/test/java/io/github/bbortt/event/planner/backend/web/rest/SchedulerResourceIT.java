package io.github.bbortt.event.planner.backend.web.rest;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SchedulerResource} REST controller.
 */
class SchedulerResourceIT extends AbstractApplicationContextAwareIT {

    static final String TEST_USER_LOGIN = "schedulerresourceit-user";

    static final String RESPONSIBILITY_COLOR = "this-is-no-color";

    @Autowired
    EntityManager entityManager;

    Project project;
    Location location;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    private MockMvc restSchedulerMockMvc;

    @BeforeEach
    void initTest() {
        User user = UserResourceIT.createEntity(entityManager);
        user.setId(TEST_USER_LOGIN);
        user.setLogin(TEST_USER_LOGIN);
        user.setEmail(TEST_USER_LOGIN + "@localhost");
        entityManager.persist(user);

        project = ProjectResourceIT.createEntity(entityManager);
        project.setName("RoleRepositoryIT-project-1");
        entityManager.persist(project);

        Invitation invitation = InvitationResourceIT.createEntity(entityManager);
        invitation.setUser(user);
        invitation.setEmail("email-invitation-1@localhost");
        invitation.setProject(project);
        invitation.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation);

        Responsibility responsibility1 = ResponsibilityResourceIT.createEntity(entityManager);
        responsibility1.setProject(project);
        responsibility1.setColor(RESPONSIBILITY_COLOR);
        entityManager.persist(responsibility1);

        location = LocationResourceIT.createEntity(entityManager);
        location.setProject(project);
        entityManager.persist(location);

        Section section = SectionResourceIT.createEntity(entityManager);
        section.setLocation(location);
        entityManager.persist(section);

        Event event1 = EventResourceIT.createEntity(entityManager);
        event1.setName("SchedulerResourceIT-event-1");
        event1.setResponsibility(responsibility1);
        event1.setSection(section);
        entityManager.persist(event1);

        Event event2 = EventResourceIT.createEntity(entityManager);
        event2.setName("SchedulerResourceIT-event-1");
        event2.setUser(user);
        event2.setSection(section);
        entityManager.persist(event2);
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getColorGroupsPerProject() throws Exception {
        restSchedulerMockMvc
            .perform(get("/api/scheduler/project/" + project.getId() + "/responsibilities"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItems(startsWith("responsibility-"))))
            .andExpect(jsonPath("$.[*].color").value(hasItem(RESPONSIBILITY_COLOR)));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    @Disabled("TODO: Test this when frontend is up!")
    void getSchedulerLocation() throws Exception {
        List<Event> all = eventRepository.findAll();

        restSchedulerMockMvc
            .perform(get("/api/scheduler/project/" + project.getId() + "/location/" + location.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.events", hasSize(2)))
            .andExpect(jsonPath("$.sections", hasSize(1)))
            .andExpect(jsonPath("$.colorGroups.[*].id").value(hasItems(startsWith("responsibility-"), startsWith("user-"))));
    }
}
