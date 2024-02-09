package io.github.bbortt.event.planner.web.api.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ApiProjectMemberMapperTest {

    private static final ZoneId ZONE_ID = ZoneId.of("UTC");

    private Member member;
    private MemberDTO memberDTO;

    private ApiProjectMemberMapper fixture;

    @BeforeEach
    void beforeEachSetup() {
        Instant acceptedDate = Instant.parse("2021-03-29T11:22:03.00Z");

        member =
            new Member()
                .id(1234L)
                .email("songbird@localhost")
                .createdBy("Dalls Gibson")
                .createdDate(OffsetDateTime.parse("2023-04-10T09:50:00.0Z"))
                .accepted(true)
                .acceptedDate(OffsetDateTime.ofInstant(acceptedDate, ZONE_ID))
                .login("melissajoangold")
                .firstName("melissa joan")
                .lastName("gold")
                .imageUrl("http://some.image");

        User user = new User();
        user.setLogin(member.getLogin().orElseThrow());
        user.setFirstName(member.getFirstName().orElseThrow());
        user.setLastName(member.getLastName().orElseThrow());
        user.setImageUrl(member.getImageUrl().orElseThrow());

        memberDTO = new MemberDTO();
        memberDTO.setId(member.getId());
        memberDTO.setInvitedEmail(member.getEmail());
        memberDTO.setCreatedBy(member.getCreatedBy());
        memberDTO.setCreatedDate(member.getCreatedDate().toInstant());
        memberDTO.setAccepted(member.getAccepted());
        memberDTO.setAcceptedBy(member.getEmail());
        memberDTO.setAcceptedDate(acceptedDate);
        memberDTO.setUser(new AdminUserDTO(user));
        memberDTO.setProject(new ProjectDTO());

        fixture = new ApiProjectMemberMapperImpl();
        fixture.timeUtils.zoneIdProvider(() -> ZONE_ID);
    }

    @Test
    void toApiDTO() {
        Member result = fixture.toApiDTO(memberDTO);

        assertNotNull(result);
        assertThat(result).usingRecursiveComparison().ignoringFields("createdDate").isEqualTo(member);
        assertEquals(member.getCreatedDate(), result.getCreatedDate());
    }

    @Test
    void toApiDTOIsNullResistant() {
        assertNull(fixture.toApiDTO(null));
    }
}
