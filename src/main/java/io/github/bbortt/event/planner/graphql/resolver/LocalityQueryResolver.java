package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.service.LocalityService;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class LocalityQueryResolver implements GraphQLQueryResolver {

  private final LocalityService localityService;

  public LocalityQueryResolver(LocalityService localityService) {
    this.localityService = localityService;
  }

  public Set<Locality> listLocalities(Optional<Long> projectId, Optional<Long> parentLocalityId) {
    return localityService.findAllInProjectByParentLocality(projectId, parentLocalityId);
  }
}
