package io.github.bbortt.event.planner.service.mapper;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import io.github.bbortt.event.planner.web.rest.UserResourceIT;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
class MemberMapperTest {

    @Mock
    private EntityManager entityManagerMock;

    @Mock
    private UserMapper userMapper;

    private Member member;
    private MemberDTO memberDTO;

    private MemberMapper fixture;

    @BeforeEach
    void setUp() {
        fixture = new MemberMapperImpl();
        ReflectionTestUtils.setField(fixture, "userMapper", userMapper, UserMapper.class);

        member =
            new Member()
                .accepted(true)
                .acceptedBy("natasha romanoff")
                .acceptedDate(Instant.now())
                .user(UserResourceIT.createEntity(entityManagerMock))
                .project(ProjectResourceIT.createEntity(entityManagerMock));

        AdminUserDTO adminUserDTO = new AdminUserDTO(member.getUser());
        doReturn(adminUserDTO).when(userMapper).userToAdminUserDTO(member.getUser());

        memberDTO = fixture.toDto(member);
    }

    @Test
    void toDto() {
        List<Member> members = new ArrayList<>();
        members.add(member);
        members.add(null);

        List<MemberDTO> memberDTOS = fixture.toDto(members);

        assertThat(memberDTOS).isNotEmpty().size().isEqualTo(2);
        assertThat(memberDTOS.get(0)).usingRecursiveComparison().ignoringFields("project").isEqualTo(memberDTO);
        assertThat(memberDTOS.get(0)).hasFieldOrPropertyWithValue("project.name", member.getProject().getName());
        assertThat(memberDTOS.get(1)).isNull();
    }

    @Test
    void toEntity() {
        doReturn(member.getUser()).when(userMapper).userDTOToUser(memberDTO.getUser());

        List<MemberDTO> memberDTOs = new ArrayList<>();
        memberDTOs.add(memberDTO);
        memberDTOs.add(null);

        List<Member> members = fixture.toEntity(memberDTOs);

        assertThat(members).isNotEmpty().size().isEqualTo(2);
        assertThat(members.get(0)).usingRecursiveComparison().ignoringFields("project").isEqualTo(member);
        assertThat(members.get(0)).hasFieldOrPropertyWithValue("project.name", member.getProject().getName());
        assertThat(members.get(1)).isNull();
    }
}
