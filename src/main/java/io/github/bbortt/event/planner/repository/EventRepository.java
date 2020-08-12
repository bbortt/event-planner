package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Event;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Event entity.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("select event from Event event where event.user.login = ?#{principal.username}")
    List<Event> findByUserIsCurrentUser();

    @Query(
        value = "select distinct event from Event event left join fetch event.sections",
        countQuery = "select count(distinct event) from Event event"
    )
    Page<Event> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct event from Event event left join fetch event.sections")
    List<Event> findAllWithEagerRelationships();

    @Query("select event from Event event left join fetch event.sections where event.id =:id")
    Optional<Event> findOneWithEagerRelationships(@Param("id") Long id);
}
