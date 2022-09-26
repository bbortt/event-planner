package io.github.bbortt.event.planner.apps.projects.domain.repository;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import java.util.List;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Lazy
@Repository
public interface ProjectJpaRepository extends JpaRepository<Project, Long> {
  @Query(
    "select case when count(m) > 0 then true else false end from Member m where m.auth0UserId = :auth0UserSub and m.project.id = :projectId"
  )
  Boolean isMemberOfProject(@Param("auth0UserSub") String auth0UserSub, @Param("projectId") Long projectId);

  @Query(
    value = "select p from Project p inner join p.members m on p.id = m.project.id where m.auth0UserId = :auth0UserId",
    countQuery = "select count(m.id) from Member m where m.auth0UserId = :auth0UserId"
  )
  Page<Project> findAllByMemberAndArchivedIsFalse(@Param("auth0UserId") String auth0UserId, Pageable pageable);
}
