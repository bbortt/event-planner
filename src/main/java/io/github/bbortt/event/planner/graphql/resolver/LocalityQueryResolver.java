package io.github.bbortt.event.planner.graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.graphql.dto.LocalityDTO;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class LocalityQueryResolver implements GraphQLQueryResolver {

  public Set<LocalityDTO> listRootLocalities(@NotNull Long projectId) {
    return null;
  }

  public Set<LocalityDTO> listChildren(@NotNull Long localityId) {
    return null;
  }
}
