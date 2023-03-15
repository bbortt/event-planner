package io.github.bbortt.event.planner.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MemberMapperTest {

    private static final String PROJECT_NAME = "test project name";

    private MemberMapper fixture;
    private Member member;
    private MemberDTO memberDTO;

    @BeforeEach
    public void setUp() {
        fixture = new MemberMapperImpl();

        member =
            new Member()
                .accepted(true)
                .acceptedBy("natasha romanoff")
                .acceptedDate(Instant.now())
                .project(new Project().name(PROJECT_NAME));

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
        assertThat(memberDTOS.get(0)).hasFieldOrPropertyWithValue("project.name", PROJECT_NAME);
        assertThat(memberDTOS.get(1)).isNull();
    }

    @Test
    void toEntity() {
        List<MemberDTO> membersDto = new ArrayList<>();
        membersDto.add(memberDTO);
        membersDto.add(null);

        List<Member> members = fixture.toEntity(membersDto);

        assertThat(members).isNotEmpty().size().isEqualTo(2);
        assertThat(members.get(0)).usingRecursiveComparison().ignoringFields("project").isEqualTo(member);
        assertThat(members.get(0)).hasFieldOrPropertyWithValue("project.name", PROJECT_NAME);
        assertThat(members.get(1)).isNull();
    }
}
