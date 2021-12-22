package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {}
