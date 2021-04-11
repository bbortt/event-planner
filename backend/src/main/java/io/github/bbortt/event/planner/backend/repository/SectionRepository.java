package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Section;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Section entity.
 */
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    @Query("SELECT DISTINCT s FROM Section s LEFT JOIN FETCH s.events WHERE s.location.id = :locationId ORDER BY s.name")
    List<Section> findAllByLocationIdJoinEventsOrderByNameAsc(@Param("locationId") Long locationId);

    @Query("SELECT s.name FROM Section s WHERE s.id = :sectionId")
    Optional<String> findNameBySectionId(@Param("sectionId") Long sectionId);

    Optional<Section> findOneByNameAndLocationId(String name, Long locationId);
}
