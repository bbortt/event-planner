package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.mapper.MemberMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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

    private MemberService fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new MemberService(memberRepositoryMock, memberMapperMock);
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
}
