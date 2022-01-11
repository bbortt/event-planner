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
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.repository.PermissionRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;

class LocalityMutationResolverIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Autowired
  private TestJWSBuilder testJwsBuilder;

  @Autowired
  private GraphQLTestTemplate graphQLTestTemplate;

  @Autowired
  private SessionFactory sessionFactory;

  @Autowired
  private Auth0UserRepository userRepository;

  @Autowired
  private PermissionRepository permissionRepository;

  @Autowired
  private ProjectRepository projectRepository;

  @Autowired
  private MemberRepository memberRepository;

  private Auth0User auth0User;
  private Project project;
  private Member member;

  @BeforeEach
  void beforeEachSetup() {
    auth0User =
      new Auth0User(
        testJwsBuilder.getClaimsSubject(),
        "LocalityMutationResolverIntegrationTest",
        "LocalityMutationResolverIntegrationTest@localhost"
      );
    userRepository.save(auth0User);

    project = new Project("project 1", LocalDate.now(), LocalDate.now());
    project.setCreatedBy(auth0User.getUserId());
    projectRepository.save(project);

    member = new Member(project, auth0User);
    member.setCreatedBy(auth0User.getUserId());
    member.setAccepted(auth0User.getUserId());
    memberRepository.save(member);

    MemberPermission memberPermission = new MemberPermission(
      member,
      permissionRepository.findById("locality:create").orElseThrow(EntityNotFoundException::new)
    );
    memberPermission.setCreatedBy(auth0User.getUserId());
    ReflectionTestUtils.setField(member, "permissions", new HashSet<>(List.of(memberPermission)));
    memberRepository.save(member);
  }

  @Test
  void createLocality() throws IOException, JoseException {
    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    String name = "name";

    GraphQLResponse response = graphQLTestTemplate.perform(
      "graphql/create-locality.graphql",
      "CreateLocalityMutation",
      objectMapper.createObjectNode().put("projectId", project.getId()).set("locality", objectMapper.createObjectNode().put("name", name))
    );
    assertTrue(response.isOk());

    Long localityId = response.get("$.data.createLocality.id", Long.class);

    Session session = sessionFactory.openSession();
    session.beginTransaction();

    Locality locality = session.createQuery("FROM Locality WHERE id = " + localityId, Locality.class).getSingleResult();

    assertEquals(name, locality.getName());
    assertEquals(testJwsBuilder.getClaimsSubject(), locality.getCreatedBy());
    assertEquals(project, locality.getProject());

    session.delete(locality);

    session.getTransaction().commit();
    session.close();
  }

  @AfterEach
  void afterEachTeardown() {
    memberRepository.delete(member);
    projectRepository.delete(project);
    userRepository.delete(auth0User);
  }
}
