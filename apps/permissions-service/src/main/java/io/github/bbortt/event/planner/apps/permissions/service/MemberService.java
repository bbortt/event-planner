package io.github.bbortt.event.planner.apps.permissions.service;

import io.github.bbortt.event.planner.apps.permissions.domain.Member;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
public class MemberService {

  @Transactional
  public List<Long> allProjectIdsByAuth0UserId(String auth0UserId) {
    return Member.findProjectIdsByAuth0UserId(auth0UserId);
  }
}
