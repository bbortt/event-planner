package io.github.bbortt.event.planner.graphql.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.config.TestJWSBuilder;
import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ProjectQueryResolverIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  private static final String PROJECT_2_NAME = "project 2";
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final List<Member> members = new ArrayList<>();
  private final List<Project> projects = new ArrayList<>();

  @Autowired
  private TestJWSBuilder testJwsBuilder;

  @Autowired
  private GraphQLTestTemplate graphQLTestTemplate;

  @Autowired
  private Auth0UserRepository userRepository;

  @Autowired
  private ProjectRepository projectRepository;

  @Autowired
  private MemberRepository memberRepository;

  private Auth0User auth0User;

  @BeforeEach
  void beforeEachSetup() {
    auth0User =
      new Auth0User(
        testJwsBuilder.getClaimsSubject(),
        "ProjectQueryResolverIntegrationTest",
        "ProjectQueryResolverIntegrationTest@localhost"
      );
    userRepository.save(auth0User);

    Project project1 = new Project("project 1", LocalDate.now(), LocalDate.now());
    project1.setCreatedBy(auth0User.getUserId());
    Project project2 = new Project(PROJECT_2_NAME, LocalDate.now(), LocalDate.now());
    project2.setCreatedBy(auth0User.getUserId());
    Project project3 = new Project("project 3", LocalDate.now(), LocalDate.now());
    project3.setCreatedBy(auth0User.getUserId());

    projects.addAll(projectRepository.saveAll(List.of(project1, project2, project3)));

    Member member1 = new Member(project1, auth0User);
    member1.setCreatedBy(auth0User.getUserId());
    member1.setAccepted(auth0User.getUserId());
    Member member2 = new Member(project2, auth0User);
    member2.setCreatedBy(auth0User.getUserId());
    member2.setAccepted(auth0User.getUserId());
    Member member3 = new Member(project3, auth0User);
    member3.setCreatedBy(auth0User.getUserId());
    member3.setAccepted(auth0User.getUserId());

    members.addAll(memberRepository.saveAll(List.of(member1, member2, member3)));
  }

  @Test
  void getProjectAtOffsetOne() throws IOException, JoseException {
    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    GraphQLResponse response = graphQLTestTemplate.perform(
      "graphql/get-all-projects.graphql",
      "ListProjectsQuery",
      objectMapper.createObjectNode().put("count", 1).put("offset", 1)
    );
    assertTrue(response.isOk());

    List<Project> projets = response.getList("$.data.listProjects", Project.class);
    assertEquals(1, projets.size());
    assertEquals(PROJECT_2_NAME, projets.get(0).getName());
  }

  @Test
  void getAllProjectsUnpaged() throws IOException, JoseException {
    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    GraphQLResponse response = graphQLTestTemplate.perform("graphql/get-all-projects.graphql", "ListProjectsQuery");
    assertTrue(response.isOk());

    assertEquals(3, response.getList("$.data.listProjects", Project.class).size());
  }

  @AfterEach
  void afterEachTeardown() {
    members.forEach(memberRepository::delete);
    projects.forEach(projectRepository::delete);
    userRepository.delete(auth0User);

    members.clear();
    projects.clear();
  }
}
