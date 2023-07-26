package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.web.rest.MemberResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static io.github.bbortt.event.planner.test.util.SecurityContextUtil.setCurrentUsernameInAuthenticationContext;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@IntegrationTest
@WithMockUser("project-repository-it")
class ProjectRepositoryIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    @Transactional
    void findProjectsICreated() {
        String me = "this-is-me";
        String someoneElse = "someone-else";

        // Project I own
        setCurrentUsernameInAuthenticationContext(me); // sets the Project#createdBy field
        Project myProject = ProjectResourceIT
            .createEntity(entityManager)
            .token(UUID.fromString("6d664ba2-2493-4d43-bb5a-c97164033470"))
            .archived(Boolean.FALSE);
        entityManager.persist(myProject);

        // Archived Project which should not be displayed
        entityManager.persist(
            ProjectResourceIT
                .createEntity(entityManager)
                .token(UUID.fromString("9647cb80-9f0c-4e2f-9ee0-9e4e2dd7559d"))
                .archived(Boolean.TRUE)
        );

        // Project I do not own
        setCurrentUsernameInAuthenticationContext(someoneElse); // sets the Project#createdBy field
        entityManager.persist(
            ProjectResourceIT
                .createEntity(entityManager)
                .token(UUID.fromString("f5fbf397-eaf7-4083-ad8c-a04c4826a72e"))
                .archived(Boolean.FALSE)
        );

        Slice<Project> result = projectRepository.findByUsernameParticipatingIn(me, Pageable.unpaged());

        assertEquals(1, result.getNumberOfElements());
        assertEquals(myProject, result.getContent().get(0));
    }

    @Test
    @Transactional
    void findProjectsIHaveAMembershipIn() {
        String me = "this-is-me";
        String someoneElse = "someone-else";

        // Project I do not own
        setCurrentUsernameInAuthenticationContext(someoneElse); // sets the Project#createdBy field
        Project someProject = ProjectResourceIT
            .createEntity(entityManager)
            .token(UUID.fromString("6d664ba2-2493-4d43-bb5a-c97164033470"))
            .archived(Boolean.FALSE);
        entityManager.persist(someProject);

        // My memberships
        Member myMembership = MemberResourceIT
            .createEntity(entityManager)
            .invitedEmail("james-montgomery@localhost")
            .acceptedBy(me)
            .accepted(Boolean.TRUE)
            .project(someProject);
        entityManager.persist(myMembership);
        entityManager.persist(
            MemberResourceIT
                .createEntity(entityManager)
                .invitedEmail("grog@localhost") // Yes, I do have multiple alias'
                .accepted(Boolean.FALSE)
                .project(someProject)
        );

        // Someone else membership
        Member anotherMembership = MemberResourceIT
            .createEntity(entityManager)
            .invitedEmail("lord-falsworth@localhost")
            .acceptedBy(someoneElse)
            .accepted(Boolean.TRUE)
            .project(someProject);
        entityManager.persist(anotherMembership);

        Slice<Project> result = projectRepository.findByUsernameParticipatingIn(me, Pageable.unpaged());

        assertEquals(1, result.getNumberOfElements());
        assertEquals(someProject, result.getContent().get(0));
    }

    @Test
    @Transactional
    void findByTokenReturnsMatchingOnly() {
        UUID token = UUID.fromString("8d713fe4-98c4-49ad-b6bf-6f119ccdcf89");

        Project project = projectRepository.saveAndFlush(ProjectResourceIT.createEntity(entityManager).token(token));

        Optional<Project> result = projectRepository.findByToken(token);

        assertTrue(result.isPresent());
        assertEquals(project, result.orElseThrow(IllegalArgumentException::new));
    }
}
