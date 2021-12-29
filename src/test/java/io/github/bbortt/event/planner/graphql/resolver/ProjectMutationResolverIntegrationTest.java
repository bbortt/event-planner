package io.github.bbortt.event.planner.graphql.resolver;

import static io.github.bbortt.event.planner.utils.TestTimeUtils.systemDefaultZoneOffset;
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
import io.github.bbortt.event.planner.repository.ProjectRepository;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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
  private Auth0UserRepository auth0UserRepository;

  @Autowired
  private ProjectRepository projectRepository;

  private Auth0User auth0User;

  @BeforeEach
  void beforeEachSetup() {
    auth0User =
      new Auth0User(
        testJwsBuilder.getClaimsSubject(),
        "ProjectQueryResolverIntegrationTest",
        "ProjectQueryResolverIntegrationTest@localhost"
      );
    auth0UserRepository.save(auth0User);
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
            .put("startTime", "2021-12-29T07:00:00.000Z")
            .put("endTime", "2021-12-30T07:00:00.000Z")
        )
    );
    assertTrue(response.isOk());

    Long projectId = response.get("$.data.createProject.id", Long.class);
    Project project = projectRepository
      .findById(projectId)
      .orElseThrow(() -> new IllegalArgumentException("Did not find persisted Project!"));

    assertEquals(name, project.getName());
    assertEquals(testJwsBuilder.getClaimsSubject(), project.getCreatedBy());
    assertEquals(
      OffsetDateTime.of(2021, 12, 29, 8, 0, 0, 0, systemDefaultZoneOffset()).toZonedDateTime().withFixedOffsetZone(),
      project.getStartTime().withFixedOffsetZone()
    );
    assertEquals(
      OffsetDateTime.of(2021, 12, 30, 8, 0, 0, 0, systemDefaultZoneOffset()).toZonedDateTime().withFixedOffsetZone(),
      project.getEndTime().withFixedOffsetZone()
    );

    projectRepository.deleteById(project.getId());
  }

  @AfterEach
  void afterEachTeardown() {
    auth0UserRepository.delete(auth0User);
  }
}
