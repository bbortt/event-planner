package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
  @Query(
    value = "select p from Project p inner join p.members m on p.id = m.project.id where m.auth0User.userId = :auth0UserId",
    countQuery = "select count(m.id) from Member m where m.auth0User.userId = :auth0UserId"
  )
  Page<Project> findByAuth0UserIdPaged(@Param("auth0UserId") String auth0UserId, Pageable pageable);
}
