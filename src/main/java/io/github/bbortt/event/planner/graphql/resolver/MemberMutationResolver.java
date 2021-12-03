package io.github.bbortt.event.planner.graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.graphql.dto.MemberDTO;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.springframework.stereotype.Component;

@Component
public class MemberMutationResolver implements GraphQLMutationResolver {

  public MemberDTO joinProject(@NotNull @Size(min = 36, max = 36) UUID token) {
    return null;
  }
}
