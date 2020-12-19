package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Responsibility;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Responsibility entity.
 */
@Repository
public interface ResponsibilityRepository extends JpaRepository<Responsibility, Long> {
    List<Responsibility> findAllByProjectId(Long projectId);
}
