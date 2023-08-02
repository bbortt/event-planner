package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.mapper.ProjectMapper;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@WithMockUser("project-service-it")
class ProjectServiceIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    @Test
    @Transactional
    void findOneByTokenReturnsMatchingProject() {
        createAndPersistProjects(2, Boolean.FALSE);

        UUID token = UUID.fromString("b0fd5fa3-4675-4f6e-8b0e-c6e6c170cea8");
        Project project = projectRepository.save(ProjectResourceIT.createEntity(entityManager).token(token).archived(Boolean.FALSE));

        ProjectDTO result = projectService.findOneByToken(token.toString()).orElseThrow(IllegalArgumentException::new);

        assertEquals(projectMapper.toDto(project), result);
    }

    @Test
    @Transactional
    void findAllNotArchivedForCurrentUserReturnsActiveProjectsOnly() {
        int projectCount = 2;

        createAndPersistProjects(projectCount, Boolean.FALSE);
        createAndPersistProjects(projectCount, Boolean.TRUE);

        Slice<ProjectDTO> projects = projectService.findAllNotArchivedForCurrentUser(Pageable.ofSize(projectCount));

        assertEquals(projectCount, projects.getNumberOfElements());
        assertFalse(projects.hasNext());
    }

    private void createAndPersistProjects(int count, Boolean archived) {
        for (int i = 0; i < count; i++) {
            projectRepository.save(ProjectResourceIT.createEntity(entityManager).token(UUID.randomUUID()).archived(archived));
        }
    }
}
