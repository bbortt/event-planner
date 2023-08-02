package io.github.bbortt.event.planner.web.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.service.mapper.MemberMapper;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectMemberMapper;
import io.github.bbortt.event.planner.web.rest.MemberResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import io.github.bbortt.event.planner.web.rest.TestUtil;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.yaml.snakeyaml.util.UriEncoder;

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser("project-member-api-it")
class ProjectMemberApiIT {

    private static final ObjectMapper mapper = TestUtil.getObjectMapper();

    private static final String ENTITY_API_URL = "/api/rest/v1/projects/{projectId}/members";
    private static final String HEADER_X_TOTAL_COUNT = "X-Total-Count";

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ApiProjectMemberMapper apiProjectMemberMapper;

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MockMvc restProjectMockMvc;

    private Project project1;
    private Project project2;

    @BeforeEach
    void beforeEachSetup() {
        project1 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("a31f7757-e56b-4609-bda4-567a2f644c54"));
        entityManager.persist(project1);

        project2 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("4285cf80-73c5-4ba1-8cd1-ecd07a0d3a4f"));
        entityManager.persist(project2);
    }

    @Test
    @Transactional
    void findProjectMemberByTokenAndEmailReturnsCorrectMember() throws Exception {
        createAndPersistMembers(project1);

        String invitedEmail = "maximus-boltagon@example.com";

        entityManager.persist(MemberResourceIT.createEntity(entityManager).invitedEmail(invitedEmail).project(project1));

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "/email/{invitedEmail}", project1.getId(), UriEncoder.encode(invitedEmail)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.email").value(invitedEmail));
    }

    @Test
    @Transactional
    void getProjectMembersWithNextPage() throws Exception {
        int pageSize = 3;

        createAndPersistMembers(project1);
        createAndPersistMembers(project2);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "?pageSize=" + pageSize, project1.getId()))
            .andExpect(status().isOk())
            .andExpect(header().string(HEADER_X_TOTAL_COUNT, equalTo(String.valueOf(4))))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(pageSize)));
    }

    @Test
    @Transactional
    void getProjectMembersWithoutNextPage() throws Exception {
        int pageSize = 4;

        createAndPersistMembers(project1);
        createAndPersistMembers(project2);

        restProjectMockMvc
            .perform(get(ENTITY_API_URL + "?pageSize=" + pageSize, project1.getId()))
            .andExpect(status().isOk())
            .andExpect(header().string(HEADER_X_TOTAL_COUNT, equalTo(String.valueOf(pageSize))))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.contents.size()").value(equalTo(pageSize)));
    }

    @Test
    @Transactional
    void inviteMemberToProject() throws Exception {
        int databaseSizeBeforeCreate = memberRepository.findAll().size();

        io.github.bbortt.event.planner.service.api.dto.Member member = apiProjectMemberMapper.toApiDTO(
            memberMapper.toDto(MemberResourceIT.createEntity(entityManager))
        );

        restProjectMockMvc
            .perform(
                post(ENTITY_API_URL, project1.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(List.of(member)))
            )
            .andExpect(status().isCreated());

        // Validate the Member in the database
        List<Member> memberList = memberRepository.findAll();
        assertThat(memberList).hasSize(databaseSizeBeforeCreate + 1);
        Member testMember = memberList.get(memberList.size() - 1);

        assertThat(testMember.getInvitedEmail()).isEqualTo(member.getEmail());
        assertThat(testMember.getAccepted()).isEqualTo(Boolean.FALSE);
        assertThat(testMember.getAcceptedBy()).isNull();
        assertThat(testMember.getAcceptedDate()).isNull();
        assertThat(testMember.getCreatedBy()).isNotEmpty();
        assertThat(testMember.getCreatedDate()).isNotNull();
        assertThat(testMember.getProject().getId()).isEqualTo(project1.getId());
    }

    private void createAndPersistMembers(Project project) {
        entityManager.persist(MemberResourceIT.createEntity(entityManager).invitedEmail("cecilia-cardinale@localhost").project(project));
        entityManager.persist(MemberResourceIT.createEntity(entityManager).invitedEmail("narya@localhost").project(project));
        entityManager.persist(MemberResourceIT.createEntity(entityManager).invitedEmail("ilaney-brükner@localhost").project(project));
        entityManager.persist(MemberResourceIT.createEntity(entityManager).invitedEmail("lucas-bishop@localhost").project(project));
    }
}
