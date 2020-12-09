package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Location;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Location entity.
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    @EntityGraph(attributePaths = { "sections" })
    @Fetch(FetchMode.JOIN)
    Page<Location> findAllByProjectId(Long projectId, Pageable pageable);
}
