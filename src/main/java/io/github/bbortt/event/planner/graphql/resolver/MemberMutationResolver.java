package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.domain.Member;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.springframework.stereotype.Component;

@Component
public class MemberMutationResolver implements GraphQLMutationResolver {

  public Member joinProject(@NotNull @Size(min = 36, max = 36) UUID token) {
    return null;
  }
}
