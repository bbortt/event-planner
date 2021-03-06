package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Event;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Event entity.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query(value = "SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.section", countQuery = "SELECT COUNT(DISTINCT e) FROM Event e")
    Page<Event> findAllWithEagerRelationships(Pageable pageable);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.section WHERE e.id =:id")
    Optional<Event> findOneWithEagerRelationships(@Param("id") Long id);
}
