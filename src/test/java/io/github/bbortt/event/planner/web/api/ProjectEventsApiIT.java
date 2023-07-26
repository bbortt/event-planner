package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.web.rest.EventResourceIT;
import io.github.bbortt.event.planner.web.rest.LocationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser("project-events-api-it")
class ProjectEventsApiIT {

    private static final String ENTITY_API_URL = "/api/rest/v1/projects/{projectId}/events";
    private static final String HEADER_X_TOTAL_COUNT = "X-Total-Count";

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MockMvc restProjectMockMvc;

    private Project project;
    private Event event;

    @BeforeEach
    void beforeEachSetup() {
        project = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("17666d6a-0efb-4ba2-a0a0-f3888bc2f0d1"));
        entityManager.persist(project);

        Location location = LocationResourceIT.createEntity(entityManager).project(project);
        entityManager.persist(location);

        event = EventResourceIT.createEntity(entityManager).location(location);
        entityManager.persist(event);

        Project anotherProject = ProjectResourceIT
            .createEntity(entityManager)
            .token(UUID.fromString("04e76a7a-dfb5-4f1e-b965-1c8f32a2baf9"));
        entityManager.persist(anotherProject);

        Location anotherLocation = LocationResourceIT.createEntity(entityManager).project(anotherProject);
        entityManager.persist(anotherLocation);

        Event anotherEvent = EventResourceIT.createEntity(entityManager).location(anotherLocation);
        entityManager.persist(anotherEvent);
    }

    @Test
    @Transactional
    void getProjectEventsReturnsCorrectEvents() throws Exception {
        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "?pageSize=" + 2, project.getId()))
            .andExpect(status().isOk())
            .andExpect(header().string(HEADER_X_TOTAL_COUNT, equalTo(String.valueOf(1))))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(1)))
            .andExpect(jsonPath("$.contents[0].id").value(equalTo(event.getId().intValue())));
    }
}
