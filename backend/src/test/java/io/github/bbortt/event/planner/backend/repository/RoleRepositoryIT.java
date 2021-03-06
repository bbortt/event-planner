package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.web.rest.InvitationResourceIT;
import io.github.bbortt.event.planner.backend.web.rest.ProjectResourceIT;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityManager;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class RoleRepositoryIT extends AbstractApplicationContextAwareIT {

    static final String USER_1_LOGIN = "rolerepositoryit-user-1";
    static final String USER_2_LOGIN = "rolerepositoryit-user-2";

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    EntityManager entityManager;

    Project project1;
    Project project2;

    @Autowired
    private InvitationRepository invitationRepository;

    @BeforeEach
    void initTest() {
        project1 = ProjectResourceIT.createEntity(entityManager);
        project1.setName("RoleRepositoryIT-project-1");
        entityManager.persist(project1);
        project2 = ProjectResourceIT.createEntity(entityManager);
        project2.setName("RoleRepositoryIT-project-2");
        entityManager.persist(project2);

        Invitation invitation1 = InvitationResourceIT.createEntity(entityManager);
        invitation1.jhiUserId(USER_1_LOGIN);
        invitation1.setEmail("email-invitation-1@localhost");
        invitation1.setProject(project1);
        invitation1.setRole(roleRepository.roleAdmin());
        invitation1.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation1);
        Invitation invitation2 = InvitationResourceIT.createEntity(entityManager);
        invitation2.jhiUserId(USER_2_LOGIN);
        invitation2.setEmail("email-invitation-2@localhost");
        invitation2.setProject(project1);
        invitation2.setRole(roleRepository.roleAdmin());
        invitation2.setAccepted(Boolean.FALSE);
        entityManager.persist(invitation2);
        Invitation invitation3 = InvitationResourceIT.createEntity(entityManager);
        invitation3.jhiUserId(USER_1_LOGIN);
        invitation3.setEmail("email-invitation-3@localhost");
        invitation3.setProject(project2);
        invitation3.setRole(roleRepository.roleViewer());
        invitation3.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation3);
    }

    @Test
    @Transactional
    void hasAnyRoleInProjectReturnsTrueOnMatch() {
        List<String> roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project1, USER_1_LOGIN, roles)).isTrue();
    }

    @Test
    @Transactional
    void hasAnyRoleInProjectReturnsFalseOnAnyMismatch() {
        // wrong user
        List<String> roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project1, USER_2_LOGIN, roles)).isFalse();

        // wrong role
        roles = Collections.singletonList(RolesConstants.VIEWER);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project1, USER_1_LOGIN, roles)).isFalse();

        // not accepted
        roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project1, USER_2_LOGIN, roles)).isFalse();

        // not even in project
        roles = Collections.singletonList(RolesConstants.ADMIN);
        Assertions.assertThat(roleRepository.hasAnyRoleInProject(project2, USER_2_LOGIN, roles)).isFalse();
    }
}
