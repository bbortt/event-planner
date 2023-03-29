package io.github.bbortt.event.planner.web.api.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ApiProjectMemberMapperTest {

    private Member member;
    private MemberDTO memberDTO;

    private ApiProjectMemberMapper fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ApiProjectMemberMapperImpl();

        Instant acceptedDate = Instant.parse("2021-03-29T11:22:03.00Z");

        member =
            new Member()
                .id(1234L)
                .email("songbird@localhost")
                .accepted(true)
                .acceptedDate(OffsetDateTime.ofInstant(acceptedDate, ZoneId.systemDefault()))
                .login("melissajoangold")
                .firstName("melissa joan")
                .lastName("gold")
                .imageUrl("http://some.image");

        User user = new User();
        user.setLogin(member.getLogin());
        user.setFirstName(member.getFirstName());
        user.setLastName(member.getLastName());
        user.setImageUrl(member.getImageUrl());

        memberDTO = new MemberDTO();
        memberDTO.setId(member.getId());
        memberDTO.setInvitedEmail(member.getEmail());
        memberDTO.setAccepted(member.getAccepted());
        memberDTO.setAcceptedBy(member.getEmail());
        memberDTO.setAcceptedDate(acceptedDate);
        memberDTO.setUser(new AdminUserDTO(user));
        memberDTO.setProject(new ProjectDTO());
    }

    @Test
    void toApiDTO() {
        Member result = fixture.toApiDTO(memberDTO);

        assertThat(result).isNotNull();
        assertThat(result).usingRecursiveComparison().isEqualTo(member);
    }

    @Test
    void toApiDTOIsNullResistant() {
        assertNull(fixture.toApiDTO(null));
    }
}
