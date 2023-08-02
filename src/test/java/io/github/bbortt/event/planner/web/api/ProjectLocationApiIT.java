package io.github.bbortt.event.planner.web.api;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.web.rest.LocationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser("project-location-api-it")
class ProjectLocationApiIT {

    private static final String ENTITY_API_URL = "/api/rest/v1/projects/{projectId}/locations";

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MockMvc restProjectMockMvc;

    @Autowired
    private LocationRepository locationRepository;

    private Project project1;
    private Project project2;

    @BeforeEach
    void beforeEachSetup() {
        project1 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("403dfdd0-6f7f-41ef-b049-0bf1efd801b6"));
        entityManager.persist(project1);

        project2 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("418dd14d-63d9-4105-97c3-310728aad44e"));
        entityManager.persist(project2);
    }

    @Test
    @Transactional
    void getProjectLocations() throws Exception {
        int locationsCount = 4;

        createAndPersistLocations(locationsCount, project1);
        createAndPersistLocations(locationsCount, project2);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL, project1.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(locationsCount)));
    }

    @Test
    @Transactional
    void getProjectLocationsWithoutSelf() throws Exception {
        int locationsCount = 4;

        createAndPersistLocations(locationsCount, project1);
        createAndPersistLocations(locationsCount, project2);

        List<Location> locations = locationRepository.findAllByParentIsNullAndProject_IdEquals(project1.getId());
        Location excludedLocation = locations.get(2);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "/{locationId}/allInProjectExceptThis", project1.getId(), excludedLocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(locationsCount - 1)));
    }

    private void createAndPersistLocations(int count, Project project) {
        for (int i = 0; i < count; i++) {
            entityManager.persist(LocationResourceIT.createEntity(entityManager).project(project));
        }
    }
}
