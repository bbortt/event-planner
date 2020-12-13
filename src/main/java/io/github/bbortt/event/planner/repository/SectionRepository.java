package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Section;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Section entity.
 */
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {}
