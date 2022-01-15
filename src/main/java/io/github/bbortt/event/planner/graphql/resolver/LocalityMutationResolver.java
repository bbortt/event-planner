package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.graphql.dto.LocalityCreateInput;
import io.github.bbortt.event.planner.graphql.dto.LocalityUpdateInput;
import io.github.bbortt.event.planner.service.LocalityService;
import io.github.bbortt.event.planner.service.ProjectService;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityMutationResolver implements GraphQLMutationResolver {

  private final LocalityService localityService;
  private final ProjectService projectService;

  public LocalityMutationResolver(LocalityService localityService, ProjectService projectService) {
    this.localityService = localityService;
    this.projectService = projectService;
  }

  public Locality createLocality(@NotNull Long projectId, @Valid LocalityCreateInput localityCreateInput) {
    Locality locality = new Locality(localityCreateInput.getName(), projectService.findById(projectId));
    locality.setDescription(localityCreateInput.getDescription());

    if (localityCreateInput.getParentLocalityId() != null) {
      return localityService.createLocality(locality, localityCreateInput.getParentLocalityId());
    }

    return localityService.createLocality(locality);
  }

  public Locality updateLocality(@Valid LocalityUpdateInput localityUpdateInput) {
    return localityService.updateLocality(localityUpdateInput.getId(), localityUpdateInput.getName(), localityUpdateInput.getDescription());
  }

  public Locality moveLocality(Optional<Long> fromLocalityId, Optional<Long> toLocalityId) {
    return null;
  }
}
