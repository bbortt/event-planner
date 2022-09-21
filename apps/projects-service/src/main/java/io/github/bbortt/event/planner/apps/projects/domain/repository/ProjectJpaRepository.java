package io.github.bbortt.event.planner.apps.projects.domain.repository;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Lazy
@Repository
public interface ProjectJpaRepository extends JpaRepository<Project, Long> {
  Page<Project> findAllByArchivedIsFalse(Pageable pageable);
}
