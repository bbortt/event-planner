package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Location;
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
    @EntityGraph(attributePaths = { "project", "responsibility" })
    List<Location> findAllByProjectId(Long projectId, Sort sort);

    @Query("SELECT l.name FROM Location l WHERE l.id = :locationId")
    Optional<String> findNameByLocationId(@Param("locationId") Long locationId);
}
