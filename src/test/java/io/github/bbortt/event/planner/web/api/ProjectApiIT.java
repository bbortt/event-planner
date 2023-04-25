package io.github.bbortt.event.planner.web.api;

import static io.github.bbortt.event.planner.config.Constants.SLICE_HAS_NEXT_PAGE_HEADER;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser("project-api-it")
class ProjectApiIT {

    private static final String ENTITY_API_URL = "/api/rest/v1/projects";
    private static final int PAGE_SIZE = 3;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MockMvc restProjectMockMvc;

    @Test
    @Transactional
    void getMyProjectsWithNextPage() throws Exception {
        int projectCount = 4;

        createAndPersistProjects(projectCount);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "?pageSize=" + PAGE_SIZE))
            .andExpect(status().isOk())
            .andExpect(header().string(SLICE_HAS_NEXT_PAGE_HEADER, equalTo("true")))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(PAGE_SIZE)));
    }

    @Test
    @Transactional
    void getMyProjectsWithoutNextPage() throws Exception {
        createAndPersistProjects(PAGE_SIZE);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "?pageSize=" + PAGE_SIZE))
            .andExpect(status().isOk())
            .andExpect(header().string(SLICE_HAS_NEXT_PAGE_HEADER, equalTo("false")))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(PAGE_SIZE)));
    }

    @Test
    @Transactional
    void getMyProjectsWithoutArchivedProjects() throws Exception {
        int projectCount = 2;

        createAndPersistProjects(projectCount);
        createAndPersistProjects(projectCount, Boolean.TRUE);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "?pageSize=" + PAGE_SIZE))
            .andExpect(status().isOk())
            .andExpect(header().string(SLICE_HAS_NEXT_PAGE_HEADER, equalTo("false")))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(projectCount)));
    }

    private void createAndPersistProjects(int count) {
        createAndPersistProjects(count, Boolean.FALSE);
    }

    private void createAndPersistProjects(int count, Boolean archived) {
        for (int i = 0; i < count; i++) {
            projectRepository.save(ProjectResourceIT.createEntity(entityManager).token(UUID.randomUUID()).archived(archived));
        }
    }
}
