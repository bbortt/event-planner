package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.security.RolesConstants;
import java.util.Collections;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.transaction.annotation.Transactional;

@Sql({ "classpath:db/scripts/RoleRepositoryIT_before.sql" })
@Sql(value = { "classpath:db/scripts/RoleRepositoryIT_after.sql" }, executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
class RoleRepositoryIT extends AbstractApplicationContextAwareIT {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Test
    @Transactional
    void hasAnyRoleInProjectReturnsTrueOnMatch() {
        Project project = projectByName("RoleRepositoryIT-project-1");
        List<String> roles = Collections.singletonList(RolesConstants.ADMIN);

        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project, "RoleRepositoryIT-user-1", roles)).isTrue();
    }

    @Test
    @Transactional
    void hasAnyRoleInProjectReturnsFalseOnAnyMismatch() {
        // wrong user
        Project project = projectByName("RoleRepositoryIT-project-1");
        List<String> roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project, "RoleRepositoryIT-user-2", roles)).isFalse();

        // wrong role
        project = projectByName("RoleRepositoryIT-project-1");
        roles = Collections.singletonList(RolesConstants.VIEWER);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project, "RoleRepositoryIT-user-1", roles)).isFalse();

        // not accepted
        project = projectByName("RoleRepositoryIT-project-1");
        roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project, "RoleRepositoryIT-user-2", roles)).isFalse();

        // not even in project
        project = projectByName("RoleRepositoryIT-project-2");
        roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project, "RoleRepositoryIT-user-2", roles)).isFalse();
    }

    private Project projectByName(String name) {
        return projectRepository
            .findOne(Example.of(new Project().name(name)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid test data!"));
    }
}
