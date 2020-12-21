package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Location;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Location entity.
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    @EntityGraph(attributePaths = { "sections", "responsibility" })
    List<Location> findAllByProjectId(Long projectId);
}
