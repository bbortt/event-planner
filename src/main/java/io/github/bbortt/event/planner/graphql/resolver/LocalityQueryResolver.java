package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.domain.Locality;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityQueryResolver implements GraphQLQueryResolver {

  public Set<Locality> listRootLocalities(@NotNull Long projectId) {
    return null;
  }

  public Set<Locality> listChildren(@NotNull Long localityId) {
    return null;
  }
}
