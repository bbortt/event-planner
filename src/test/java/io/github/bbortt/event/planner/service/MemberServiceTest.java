package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.mail.MailService;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.mapper.MemberMapper;
import io.github.bbortt.event.planner.service.mapper.ProjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepositoryMock;

    @Mock
    private MemberMapper memberMapperMock;

    @Mock
    private ProjectMapper projectMapperMock;

    @Mock
    private MailService mailServiceMock;

    @Captor
    private ArgumentCaptor<Member> memberArgumentCaptor;

    private MemberService fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new MemberService(memberRepositoryMock, memberMapperMock, projectMapperMock, mailServiceMock);
    }

    @Test
    void findInProjectCallsRepository() {
        Long projectId = 1234l;
        Pageable pageable = Pageable.unpaged();

        Member member = new Member();
        MemberDTO memberDto = new MemberDTO();

        doReturn(new PageImpl<>(List.of(member))).when(memberRepositoryMock).findAllByProjectIdEquals(projectId, pageable);
        doReturn(memberDto).when(memberMapperMock).toDto(member);

        Page<MemberDTO> result = fixture.findInProject(projectId, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(memberDto, result.getContent().get(0));

        verify(memberRepositoryMock).findAllByProjectIdEquals(projectId, pageable);
    }

    @Test
    void inviteToProjectSetsDefaultValuesAndSendsMail() {
        String email = "delroy-garrett@localhost";

        Project project = new Project();
        ProjectDTO projectDTO = new ProjectDTO();
        doReturn(project).when(projectMapperMock).toEntity(projectDTO);

        Member member = new Member();
        doReturn(member).when(memberRepositoryMock).save(any(Member.class));

        MemberDTO memberDto = new MemberDTO();
        doReturn(memberDto).when(memberMapperMock).toDto(member);

        MemberDTO result = fixture.inviteToProject(email, projectDTO);

        assertEquals(memberDto, result);

        verify(memberRepositoryMock).save(memberArgumentCaptor.capture());

        Member persistedEntity = memberArgumentCaptor.getValue();
        assertEquals(email, persistedEntity.getInvitedEmail());
        assertEquals(Boolean.FALSE, persistedEntity.getAccepted());
        assertEquals(project, persistedEntity.getProject());

        verify(mailServiceMock).sendProjectInvitationEmail(memberDto);
    }
}
