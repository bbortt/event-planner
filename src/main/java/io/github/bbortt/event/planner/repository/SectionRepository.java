package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Section entity.
 */
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    @Modifying
    long deleteAllByLocationId(Long locationId);
}
