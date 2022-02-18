package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.domain.Member;
import java.util.Optional;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class MemberQueryResolver implements GraphQLQueryResolver {

  public Set<Member> listMembers(@NotNull Long projectId) {
    return null;
  }

  public Member getMember(@NotNull Long memberId) {
    return null;
  }
}
