package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.test.context.support.WithMockUser;

@WithMockUser
@IntegrationTest
public class ProjectServiceIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    @Test
    void findForCurrentUserReturnsActiveProjectsOnly() {
        int projectCount = 2;

        createAndPersistProjects(projectCount, Boolean.FALSE);
        createAndPersistProjects(projectCount, Boolean.TRUE);

        Slice<ProjectDTO> projects = projectService.findForCurrentUser(Pageable.ofSize(projectCount));

        assertEquals(projectCount, projects.getNumberOfElements());
        assertFalse(projects.hasNext());
    }

    private void createAndPersistProjects(int count, Boolean archived) {
        for (int i = 0; i < count; i++) {
            projectRepository.save(ProjectResourceIT.createEntity(entityManager).token(UUID.randomUUID()).archived(archived));
        }
    }
}
