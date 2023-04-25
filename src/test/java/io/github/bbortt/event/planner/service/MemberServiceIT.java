package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.rest.MemberResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@WithMockUser("member-service-it")
class MemberServiceIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberService memberService;

    private Project project1;
    private Project project2;

    @BeforeEach
    void beforeEachSetup() {
        project1 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("8f60d6c3-89cb-49da-9604-1d5acd5fdd76"));
        entityManager.persist(project1);

        project2 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("93bbcb2c-50a5-496b-b524-62f9f32eb300"));
        entityManager.persist(project2);
    }

    @Test
    @Transactional
    void findInProjectReturnsMembersInProject() {
        memberRepository.save(
            MemberResourceIT.createEntity(entityManager).invitedEmail("victor-von-doom@localhost").accepted(Boolean.FALSE).project(project1)
        );
        memberRepository.save(
            MemberResourceIT.createEntity(entityManager).invitedEmail("john-walker@localhost").accepted(Boolean.TRUE).project(project1)
        );
        memberRepository.save(
            MemberResourceIT.createEntity(entityManager).invitedEmail("victor-von-doom@localhost").accepted(Boolean.FALSE).project(project2)
        );
        memberRepository.save(
            MemberResourceIT.createEntity(entityManager).invitedEmail("john-walker@localhost").accepted(Boolean.TRUE).project(project2)
        );

        Page<MemberDTO> members = memberService.findAllInProject(project1.getId(), Pageable.ofSize(3));

        assertEquals(1, members.getTotalPages());
        assertEquals(2, members.getTotalElements());
    }

    @Test
    @Transactional
    void inviteToProjectPersistsNewEntity() {
        String email = "kyle-brock@localhost";

        assertFalse(findByEmail(email));

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setId(project1.getId());
        projectDTO.setToken(UUID.fromString("fc2da339-e3de-4ee4-9df7-668c2fb82a4d"));

        MemberDTO memberDTO = memberService.inviteToProject(email, projectDTO);

        assertEquals(email, memberDTO.getInvitedEmail());
        assertEquals(Boolean.FALSE, memberDTO.getAccepted());
        assertEquals(projectDTO, memberDTO.getProject());

        assertTrue(memberRepository.findById(memberDTO.getId()).isPresent());
        assertTrue(findByEmail(email));
    }

    private boolean findByEmail(String email) {
        return memberRepository.findOne(Example.of(new Member().invitedEmail(email).createdDate(null))).isPresent();
    }
}
