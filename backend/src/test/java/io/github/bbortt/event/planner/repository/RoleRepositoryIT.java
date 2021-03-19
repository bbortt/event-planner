package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.web.rest.InvitationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import io.github.bbortt.event.planner.web.rest.UserResourceIT;
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

    @BeforeEach
    void initTest() {
        User user1 = UserResourceIT.createEntity(entityManager);
        user1.setId(USER_1_LOGIN);
        user1.setLogin(USER_1_LOGIN);
        user1.setEmail(USER_1_LOGIN + "@localhost");
        entityManager.persist(user1);
        User user2 = UserResourceIT.createEntity(entityManager);
        user2.setId(USER_2_LOGIN);
        user2.setLogin(USER_2_LOGIN);
        user2.setEmail(USER_2_LOGIN + "@localhost");
        entityManager.persist(user2);

        project1 = ProjectResourceIT.createEntity(entityManager);
        project1.setName("RoleRepositoryIT-project-1");
        entityManager.persist(project1);
        project2 = ProjectResourceIT.createEntity(entityManager);
        project2.setName("RoleRepositoryIT-project-2");
        entityManager.persist(project2);

        Invitation invitation1 = InvitationResourceIT.createEntity(entityManager);
        invitation1.setUser(user1);
        invitation1.setEmail("email-invitation-1@localhost");
        invitation1.setProject(project1);
        invitation1.setRole(roleRepository.roleAdmin());
        invitation1.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation1);
        Invitation invitation2 = InvitationResourceIT.createEntity(entityManager);
        invitation2.setUser(user2);
        invitation2.setEmail("email-invitation-2@localhost");
        invitation2.setProject(project1);
        invitation2.setRole(roleRepository.roleAdmin());
        invitation2.setAccepted(Boolean.FALSE);
        entityManager.persist(invitation2);
        Invitation invitation3 = InvitationResourceIT.createEntity(entityManager);
        invitation3.setUser(user1);
        invitation3.setEmail("email-invitation-3@localhost");
        invitation3.setProject(project2);
        invitation3.setRole(roleRepository.roleViewer());
        invitation3.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation3);
    }

    @Autowired
    private InvitationRepository invitationRepository;

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
