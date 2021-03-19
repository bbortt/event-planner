package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.web.rest.InvitationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import io.github.bbortt.event.planner.web.rest.UserResourceIT;
import javax.persistence.EntityManager;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.transaction.annotation.Transactional;

class ProjectRepositoryIT extends AbstractApplicationContextAwareIT {
     static final String TEST_USER_1 = "projectrepositoryit-user-1";

    @Autowired
    RoleRepository roleRepository;

    @Autowired
 ProjectRepository projectRepository;

    @Autowired
    EntityManager entityManager;

    Project project1;
    Project project2;
    Project project3;

    @BeforeEach
    void initTest() {
        User user1 = UserResourceIT.createEntity(entityManager);
        user1.setId(TEST_USER_1);
        user1.setLogin(TEST_USER_1);
        user1.setEmail(TEST_USER_1 + "@localhost");
        entityManager.persist(user1);
        User user2 = UserResourceIT.createEntity(entityManager);
        user2.setId("projectrepositoryit-user-2");
        user2.setLogin(user2.getId());
        user2.setEmail(user2.getId() + "@localhost");
        entityManager.persist(user2);

        project1 = ProjectResourceIT.createEntity(entityManager);
        project1.setName("ProjectRepositoryIT-project-1");
        entityManager.persist(project1);
        project2 = ProjectResourceIT.createEntity(entityManager);
        project2.setName("ProjectRepositoryIT-project-2");
        entityManager.persist(project2);
  project3 = ProjectResourceIT.createEntity(entityManager);
        project3.setName("ProjectRepositoryIT-project-3");
        entityManager.persist(project3);
 Project project4 = ProjectResourceIT.createEntity(entityManager);
        project4.setName("ProjectRepositoryIT-project-4");
        entityManager.persist(project4);

        Invitation invitation1 = InvitationResourceIT.createEntity(entityManager);
        invitation1.setUser(user1);
        invitation1.setEmail("email-invitation-1@localhost");
        invitation1.setProject(project1);
        invitation1.setRole(roleRepository.roleViewer());
        invitation1.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation1);
        Invitation invitation2 = InvitationResourceIT.createEntity(entityManager);
        invitation2.setUser(user1);
        invitation2.setEmail("email-invitation-2@localhost");
        invitation2.setProject(project2);
        invitation2.setRole(roleRepository.roleViewer());
        invitation2.setAccepted(Boolean.FALSE);
        entityManager.persist(invitation2);
        Invitation invitation3 = InvitationResourceIT.createEntity(entityManager);
        invitation3.setUser(user1);
        invitation3.setEmail("email-invitation-3@localhost");
        invitation3.setProject(project3);
        invitation3.setRole(roleRepository.roleViewer());
        invitation3.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation3);
        Invitation invitation4 = InvitationResourceIT.createEntity(entityManager);
        invitation4.setUser(user2);
        invitation4.setEmail("email-invitation-3@localhost");
        invitation4.setProject(project4);
        invitation4.setRole(roleRepository.roleViewer());
        invitation4.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation4);
    }


    @Test
    @Transactional
    void findMineByArchivedDoesReturnMyProjectsOnly() {
        Page<Project> projects = projectRepository.findMineByArchived(TEST_USER_1, false, Pageable.unpaged());
        Assertions.assertThat(projects).hasSize(2);
    }

    @Test
    @Transactional
    void findMineByArchivedDoesReturnArchived() {
        Page<Project> projects = projectRepository.findMineByArchived(TEST_USER_1, true, Pageable.unpaged());
        Assertions.assertThat(projects).hasSize(1).first().hasFieldOrPropertyWithValue("name", project3.getName());
    }

    @Test
    @Transactional
    void findMineByArchivedQueryRespectsPageable() {
        PageRequest pageRequest = PageRequest.of(0, 1, Sort.by(Direction.ASC, "name"));

        Page<Project> projects = projectRepository.findMineByArchived(TEST_USER_1, false, pageRequest);
        Assertions.assertThat(projects).hasSize(1).first().hasFieldOrPropertyWithValue("name", project1.getName());

        pageRequest = PageRequest.of(0, 1, Sort.by(Direction.DESC, "name"));

        projects = projectRepository.findMineByArchived(TEST_USER_1, false, pageRequest);
        Assertions.assertThat(projects).hasSize(1).first().hasFieldOrPropertyWithValue("name", project2.getName());
    }

    @Test
    @Transactional
    void archiveUpdatesEntity() {
        projectRepository.archive(project1.getId());
        Assertions.assertThat(project1.isArchived()).isTrue();
    }
}
