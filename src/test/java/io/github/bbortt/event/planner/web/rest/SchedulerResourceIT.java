package io.github.bbortt.event.planner.web.rest;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SchedulerResource} REST controller.
 */
@Sql({ "classpath:db/scripts/SchedulerResourceIT_before.sql" })
@Sql(value = { "classpath:db/scripts/SchedulerResourceIT_after.sql" }, executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
public class SchedulerResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "SchedulerResourceIT-user";
    private static final String PROJECT_NAME = "SchedulerResourceIT-project-1";
    private static final String LOCATION_NAME = "SchedulerResourceIT-location";

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private MockMvc restSchedulerMockMvc;

    private Project project;
    private Location location;

    @BeforeEach
    void initTest() {
        project =
            projectRepository
                .findAll()
                .stream()
                .filter(project -> project.getName().equals(PROJECT_NAME))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);

        location = locationRepository.findOneByNameAndProjectId(LOCATION_NAME, project.getId()).orElseThrow(IllegalArgumentException::new);
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
            .andExpect(jsonPath("$.[*].color").value(hasItem("this-is-no-color")));
    }

    @Test
    @Transactional
    @WithMockUser(TEST_USER_LOGIN)
    void getSchedulerLocation() throws Exception {
        restSchedulerMockMvc
            .perform(get("/api/scheduler/project/" + project.getId() + "/location/" + location.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.events", hasSize(2)))
            .andExpect(jsonPath("$.sections", hasSize(1)))
            .andExpect(jsonPath("$.colorGroups.[*].id").value(hasItems(startsWith("responsibility-"), startsWith("user-"))));
    }
}
