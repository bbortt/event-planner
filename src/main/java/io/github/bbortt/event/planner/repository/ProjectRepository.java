package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
  @Query(
    value = "select p, m from member m" + " left join project p" + "   on m.project_id = p.id" + " where m.auth0_user_id = :auth0UserId",
    countQuery = "select count(id) from member" + " where auth0_user_id = :auth0UserId",
    nativeQuery = true
  )
  Page<Project> findByAuth0UserIdPaged(@Param("auth0UserId") String auth0UserId, Pageable pageable);
}
