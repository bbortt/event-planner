package io.github.bbortt.event.planner.graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.graphql.dto.MemberDTO;
import java.util.Optional;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

@Component
public class MemberQueryResolver implements GraphQLQueryResolver {

  public Set<MemberDTO> listMembers(@NotNull Long projectId) {
    return null;
  }

  public Optional<MemberDTO> getMember(@NotNull Long memberId) {
    return null;
  }
}
