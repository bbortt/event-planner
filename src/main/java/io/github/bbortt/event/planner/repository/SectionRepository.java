package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Section;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Section entity.
 */
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findAllByLocationId(Long locationId, Sort sort);

    @Modifying
    long deleteAllByLocationId(Long locationId);
}
