package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Section;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Section entity.
 */
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findAllByLocationId(Long locationId, Sort sort);

    @Query(value = "SELECT DISTINCT s FROM Section s LEFT JOIN FETCH s.events WHERE s.location.id = :locationId ORDER BY s.name")
    List<Section> findAllByLocationIdJoinEventsOrderByNameAsc(@Param("locationId") Long locationId);

    @Modifying
    long deleteAllByLocationId(Long locationId);
}
