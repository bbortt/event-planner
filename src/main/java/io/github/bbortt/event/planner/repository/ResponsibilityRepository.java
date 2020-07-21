package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Responsibility;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Responsibility entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResponsibilityRepository extends JpaRepository<Responsibility, Long> {}
