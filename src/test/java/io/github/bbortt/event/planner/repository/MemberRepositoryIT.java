package io.github.bbortt.event.planner.repository;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.web.rest.MemberResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import java.util.Objects;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
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

    private Project project;

    @BeforeEach
    void beforeEachSetup() {
        project = ProjectResourceIT.createEntity(entityManager);
        entityManager.persist(project);
    }

    @Test
    @Transactional
    void uniqueInvitationPerProject() {
        entityManager.persist(createNewMember());

        Member constraintViolatingMember = createNewMember();
        DataIntegrityViolationException exception = assertThrows(
            DataIntegrityViolationException.class,
            () -> memberRepository.saveAndFlush(constraintViolatingMember)
        );
        assertTrue(Objects.requireNonNull(exception.getMessage()).contains("ux_invitation_per_project"));
    }

    @Test
    @Transactional
    void uniqueAcceptedPerProject() {
        String acceptedBy = "matthew-murdoch@localhost";

        entityManager.persist(createAcceptedMember(acceptedBy).invitedEmail("maya-lopez@localhost"));

        Member constraintViolatingMember = createAcceptedMember(acceptedBy);
        DataIntegrityViolationException exception = assertThrows(
            DataIntegrityViolationException.class,
            () -> memberRepository.saveAndFlush(constraintViolatingMember)
        );
        assertTrue(Objects.requireNonNull(exception.getMessage()).contains("ux_accepted_per_project"));
    }

    @Test
    @Transactional
    void findMemberInProject() {
        String acceptedBy = "jennifer-walters@localhost";

        Member member = createAcceptedMember(acceptedBy);
        entityManager.persist(member);

        assertTrue(memberRepository.findMemberInProject(member.getAcceptedBy(), project.getId()).isPresent());
        assertTrue(memberRepository.findMemberInProject(member.getInvitedEmail(), project.getId()).isPresent());
    }

    private Member createAcceptedMember(String acceptedBy) {
        return createNewMember().accepted(Boolean.TRUE).acceptedBy(acceptedBy);
    }

    private Member createNewMember() {
        return MemberResourceIT
            .createEntity(entityManager)
            .invitedEmail("victor-von-doom@localhost")
            .accepted(Boolean.FALSE)
            .project(project);
    }
}
