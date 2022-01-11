package io.github.bbortt.event.planner.graphql.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.config.TestJWSBuilder;
import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import io.github.bbortt.event.planner.repository.PermissionRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ProjectMutationResolverIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

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

  private Auth0User auth0User;

  @BeforeEach
  void beforeEachSetup() {
    auth0User =
      new Auth0User(
        testJwsBuilder.getClaimsSubject(),
        "ProjectMutationResolverIntegrationTest",
        "ProjectMutationResolverIntegrationTest@localhost"
      );
    userRepository.save(auth0User);
  }

  @Test
  void createProject() throws IOException, JoseException {
    String token = testJwsBuilder.build("graphql:access").getCompactSerialization();
    graphQLTestTemplate.withBearerAuth(token);

    String name = "name";

    GraphQLResponse response = graphQLTestTemplate.perform(
      "graphql/create-project.graphql",
      "CreateProjectMutation",
      objectMapper
        .createObjectNode()
        .set(
          "project",
          objectMapper
            .createObjectNode()
            .put("name", name)
            .put("startDate", "2021-12-29T07:00:00.000Z")
            .put("endDate", "2021-12-30T07:00:00.000Z")
        )
    );
    assertTrue(response.isOk());

    Long projectId = response.get("$.data.createProject.id", Long.class);

    Session session = sessionFactory.openSession();
    session.beginTransaction();

    Project project = session.createQuery("FROM Project WHERE id = " + projectId, Project.class).getSingleResult();

    assertEquals(name, project.getName());
    assertEquals(testJwsBuilder.getClaimsSubject(), project.getCreatedBy());
    assertTrue(LocalDate.of(2021, 12, 29).isEqual(project.getStartDate()));
    assertTrue(LocalDate.of(2021, 12, 30).isEqual(project.getEndDate()));

    assertEquals(1, project.getMembers().size());
    assertEquals(permissionRepository.count(), new ArrayList<>(project.getMembers()).get(0).getPermissions().size());

    session.delete(project);

    session.getTransaction().commit();
    session.close();
  }

  @AfterEach
  void afterEachTeardown() {
    userRepository.delete(auth0User);
  }
}
