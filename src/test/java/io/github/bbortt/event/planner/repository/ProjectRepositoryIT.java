package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.Project;
import java.util.stream.Collectors;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.transaction.annotation.Transactional;

@Sql({ "classpath:db/scripts/ProjectRepositoryIT_before.sql" })
@Sql(value = { "classpath:db/scripts/ProjectRepositoryIT_after.sql" }, executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
public class ProjectRepositoryIT extends AbstractApplicationContextAwareIT {
    static final String TEST_USER_1 = "ProjectRepositoryIT-user-1";

    static final String PROJECT_1_NAME = "ProjectRepositoryIT-project-1";
    static final String PROJECT_2_NAME = "ProjectRepositoryIT-project-2";

    @Autowired
    ProjectRepository projectRepository;

    @Test
    @Transactional
    public void findMineDoesReturnMyProjectsOnly() {
        Page<Project> projects = projectRepository.findMine(TEST_USER_1, Pageable.unpaged());
        Assertions.assertThat(projects).hasSize(2);
    }

    @Test
    public void findMineQueryRespectsPageable() {
        PageRequest pageRequest = PageRequest.of(0, 1, Sort.by(Direction.ASC, "name"));

        Page<Project> projects = projectRepository.findMine(TEST_USER_1, pageRequest);
        Assertions.assertThat(projects).hasSize(1).first().hasFieldOrPropertyWithValue("name", PROJECT_1_NAME);

        pageRequest = PageRequest.of(0, 1, Sort.by(Direction.DESC, "name"));

        projects = projectRepository.findMine(TEST_USER_1, pageRequest);
        Assertions.assertThat(projects).hasSize(1).first().hasFieldOrPropertyWithValue("name", PROJECT_2_NAME);
    }
}
