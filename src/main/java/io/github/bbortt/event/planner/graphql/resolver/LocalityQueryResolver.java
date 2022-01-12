package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.domain.Locality;
import java.util.Optional;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityQueryResolver implements GraphQLQueryResolver {

  public Set<Locality> listLocalities(Optional<Long> localityId, Optional<Long> parentLocalityId) {
    return null;
  }
}
