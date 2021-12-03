package io.github.bbortt.event.planner.graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.graphql.dto.CreateLocalityInput;
import io.github.bbortt.event.planner.graphql.dto.LocalityDTO;
import io.github.bbortt.event.planner.graphql.dto.UpdateLocalityInput;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityMutationResolver implements GraphQLMutationResolver {

  public LocalityDTO createLocality(@NotNull Long projectId, @Valid CreateLocalityInput project) {
    return null;
  }

  public LocalityDTO updateLocality(@Valid UpdateLocalityInput project) {
    return null;
  }

  public LocalityDTO moveLocality(Optional<Long> fromLocalityId, Optional<Long> toLocalityId) {
    return null;
  }
}
