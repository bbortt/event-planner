package io.github.bbortt.event.planner.repository;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.web.rest.MemberResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import java.util.Objects;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
class MemberRepositoryIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @Transactional
    void uniqueInvitationPerProject() {
        Project project = ProjectResourceIT.createEntity(entityManager);
        entityManager.persist(project);

        memberRepository.saveAndFlush(createNewMember(project));

        Member constraintViolatingMember = createNewMember(project);
        DataIntegrityViolationException exception = assertThrows(
            DataIntegrityViolationException.class,
            () -> memberRepository.saveAndFlush(constraintViolatingMember)
        );
        assertTrue(Objects.requireNonNull(exception.getMessage()).contains("ux_invitation_per_project"));
    }

    private Member createNewMember(Project project) {
        return MemberResourceIT
            .createEntity(entityManager)
            .invitedEmail("victor-von-doom@localhost")
            .accepted(Boolean.FALSE)
            .project(project);
    }
}
