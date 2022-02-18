package io.github.bbortt.event.planner.graphql.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.config.TestJWSBuilder;
import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.MemberPermission;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import io.github.bbortt.event.planner.repository.LocalityRepository;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.repository.PermissionRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;

class LocalityQueryResolverIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  private final ObjectMapper objectMapper = new ObjectMapper();

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

  @Autowired
  private LocalityRepository localityRepository;

  @Autowired
  private PermissionRepository permissionRepository;

  private Auth0User auth0User;
  private Member member;
  private Project project;
  private Locality parentLocality;
  private Locality childLocality;

  @BeforeEach
  void beforeEachSetup() {
    auth0User =
      new Auth0User(
        testJwsBuilder.getClaimsSubject(),
        "LocalityQueryResolverIntegrationTest",
        "LocalityQueryResolverIntegrationTest@localhost"
      );
    userRepository.save(auth0User);

    project = new Project("project", LocalDate.now(), LocalDate.now());
    project.setCreatedBy(auth0User.getUserId());
    projectRepository.save(project);

    member = new Member(project, auth0User);
    member.setCreatedBy(auth0User.getUserId());
    member.setAccepted(auth0User.getUserId());
    memberRepository.save(member);

    parentLocality = new Locality("locality 1", project);
    parentLocality.setCreatedBy(auth0User.getUserId());
    localityRepository.save(parentLocality);

    childLocality = new Locality("locality 2", project);
    childLocality.setCreatedBy(auth0User.getUserId());
    childLocality.setParent(parentLocality);
    localityRepository.save(childLocality);
  }

  @Test
  void getRootLocalities() throws IOException, JoseException {
    MemberPermission memberPermission = new MemberPermission(
      member,
      permissionRepository.findById("locality:edit").orElseThrow(EntityNotFoundException::new)
    );
    memberPermission.setCreatedBy(auth0User.getUserId());
    ReflectionTestUtils.setField(member, "permissions", new HashSet<>(List.of(memberPermission)));
    memberRepository.save(member);

    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    GraphQLResponse response = graphQLTestTemplate.perform(
      "graphql/get-root-localities.graphql",
      "ListLocalitiesQuery",
      objectMapper.createObjectNode().put("projectId", project.getId())
    );
    assertTrue(response.isOk());

    List<Locality> localities = response.getList("$.data.listLocalities", Locality.class);
    assertEquals(1, localities.size());
    assertEquals(parentLocality.getId(), localities.get(0).getId());
  }

  @Test
  void getNestedLocalities() throws IOException, JoseException {
    MemberPermission memberPermission = new MemberPermission(
      member,
      permissionRepository.findById("locality:edit").orElseThrow(EntityNotFoundException::new)
    );
    memberPermission.setCreatedBy(auth0User.getUserId());
    ReflectionTestUtils.setField(member, "permissions", new HashSet<>(List.of(memberPermission)));
    memberRepository.save(member);

    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    GraphQLResponse response = graphQLTestTemplate.perform(
      "graphql/get-nested-localities.graphql",
      "ListLocalitiesQuery",
      objectMapper.createObjectNode().put("projectId", project.getId()).put("parentLocalityId", parentLocality.getId())
    );
    assertTrue(response.isOk());

    List<Locality> localities = response.getList("$.data.listLocalities", Locality.class);
    assertEquals(1, localities.size());
    assertEquals(childLocality.getId(), localities.get(0).getId());
  }

  @Test
  void listLocalitiesWithoutPermissionFails() throws IOException, JoseException {
    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    GraphQLResponse response = graphQLTestTemplate.perform(
      "graphql/get-root-localities.graphql",
      "ListLocalitiesQuery",
      objectMapper.createObjectNode().put("projectId", project.getId())
    );
    assertTrue(response.isOk());

    String errorMessage = response.get("$.errors[0].message", String.class);
    assertEquals("Exception while fetching data (/listLocalities) : Access is denied", errorMessage);
  }

  @AfterEach
  void afterEachTeardown() {
    localityRepository.deleteAll(List.of(childLocality, parentLocality));
    memberRepository.delete(member);
    projectRepository.delete(project);
    userRepository.delete(auth0User);
  }
}
