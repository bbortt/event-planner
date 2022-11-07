package io.github.bbortt.event.planner.apps.projects.domain.repository;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import java.util.Collection;
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
    value = "select p from Project p where p.id in :projectIds and p.archived = false",
    countQuery = "select count(p.id) from Project p where p.id in :projectIds and p.archived = false"
  )
  Page<Project> findAllByIdAndArchivedIsFalse(@Param("projectIds") Collection<Long> projectIds, Pageable pageable);
}
