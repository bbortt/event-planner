package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Responsibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Responsibility entity.
 */
@Repository
public interface ResponsibilityRepository extends JpaRepository<Responsibility, Long> {
    Page<Responsibility> findAllByProjectId(Long projectId, Pageable pageable);
}
