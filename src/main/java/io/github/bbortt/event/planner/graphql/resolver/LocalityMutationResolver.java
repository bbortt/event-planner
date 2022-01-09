package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.graphql.dto.LocalityCreateInput;
import io.github.bbortt.event.planner.graphql.dto.LocalityUpdateInput;
import io.github.bbortt.event.planner.service.LocalityService;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityMutationResolver implements GraphQLMutationResolver {

  private final LocalityService localityService;

  public LocalityMutationResolver(LocalityService localityService) {
    this.localityService = localityService;
  }

  public Locality createLocality(@NotNull Long projectId, @Valid LocalityCreateInput localityCreateInput) {
    Locality locality = new Locality(localityCreateInput.getName());
    locality.setDescription(localityCreateInput.getDescription());

    if (localityCreateInput.getParentLocalityId() != null) {
      return localityService.createLocality(projectId, locality, localityCreateInput.getParentLocalityId());
    }

    return localityService.createLocality(projectId, locality);
  }

  public Locality updateLocality(@Valid LocalityUpdateInput localityUpdateInput) {
    return null;
  }

  public Locality moveLocality(Optional<Long> fromLocalityId, Optional<Long> toLocalityId) {
    return null;
  }
}
