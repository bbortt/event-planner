package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.web.rest.InvitationResourceIT;
import io.github.bbortt.event.planner.backend.web.rest.ProjectResourceIT;
import javax.persistence.EntityManager;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.transaction.annotation.Transactional;

class ProjectRepositoryIT extends AbstractApplicationContextAwareIT {

    static final String TEST_USER_1 = "projectrepositoryit-user-1";
    static final String TEST_USER_2 = "projectrepositoryit-user-2";

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
        project1 = ProjectResourceIT.createEntity(entityManager);
        project1.setName("ProjectRepositoryIT-project-1");
        project1.setArchived(Boolean.FALSE);
        entityManager.persist(project1);
        project2 = ProjectResourceIT.createEntity(entityManager);
        project2.setName("ProjectRepositoryIT-project-2");
        project2.setArchived(Boolean.FALSE);
        entityManager.persist(project2);
        project3 = ProjectResourceIT.createEntity(entityManager);
        project3.setName("ProjectRepositoryIT-project-3");
        project3.setArchived(Boolean.TRUE);
        entityManager.persist(project3);
        Project project4 = ProjectResourceIT.createEntity(entityManager);
        project4.setName("ProjectRepositoryIT-project-4");
        project4.setArchived(Boolean.FALSE);
        entityManager.persist(project4);

        Invitation invitation1 = InvitationResourceIT.createEntity(entityManager);
        invitation1.jhiUserId(TEST_USER_1);
        invitation1.setEmail("email-invitation-1@localhost");
        invitation1.setProject(project1);
        invitation1.setRole(roleRepository.roleViewer());
        invitation1.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation1);
        Invitation invitation2 = InvitationResourceIT.createEntity(entityManager);
        invitation2.jhiUserId(TEST_USER_1);
        invitation2.setEmail("email-invitation-2@localhost");
        invitation2.setProject(project2);
        invitation2.setRole(roleRepository.roleViewer());
        invitation2.setAccepted(Boolean.FALSE);
        entityManager.persist(invitation2);
        Invitation invitation3 = InvitationResourceIT.createEntity(entityManager);
        invitation3.jhiUserId(TEST_USER_1);
        invitation3.setEmail("email-invitation-3@localhost");
        invitation3.setProject(project3);
        invitation3.setRole(roleRepository.roleViewer());
        invitation3.setAccepted(Boolean.TRUE);
        entityManager.persist(invitation3);
        Invitation invitation4 = InvitationResourceIT.createEntity(entityManager);
        invitation4.setJhiUserId(TEST_USER_2);
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
        entityManager.refresh(project1);
        Assertions.assertThat(project1.isArchived()).isTrue();
    }
}
