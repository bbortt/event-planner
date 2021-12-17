package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.graphql.dto.CreateLocalityInput;
import io.github.bbortt.event.planner.graphql.dto.UpdateLocalityInput;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityMutationResolver implements GraphQLMutationResolver {

  public Locality createLocality(@NotNull Long projectId, @Valid CreateLocalityInput project) {
    return null;
  }

  public Locality updateLocality(@Valid UpdateLocalityInput project) {
    return null;
  }

  public Locality moveLocality(Optional<Long> fromLocalityId, Optional<Long> toLocalityId) {
    return null;
  }
}
