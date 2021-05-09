package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Location;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Location entity.
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    @Override
    @EntityGraph(attributePaths = { "project", "responsibility", "sections" })
    Optional<Location> findById(Long id);

    @EntityGraph(attributePaths = { "project", "responsibility" })
    List<Location> findAllByProjectId(Long projectId, Sort sort);

    @Query("SELECT DISTINCT l FROM Location l LEFT JOIN FETCH l.sections WHERE l.project.id = :projectId ORDER BY l.name")
    List<Location> findAllByProjectIdJoinSectionsOrderByNameAsc(@Param("projectId") Long projectId);

    @Query("SELECT l.name FROM Location l WHERE l.id = :locationId")
    Optional<String> findNameByLocationId(@Param("locationId") Long locationId);

    Optional<Location> findOneByNameAndProjectId(String name, Long projectId);
}
