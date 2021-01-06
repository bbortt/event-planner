package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Responsibility;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Responsibility entity.
 */
@Repository
public interface ResponsibilityRepository extends JpaRepository<Responsibility, Long> {
    List<Responsibility> findAllByProjectId(Long projectId, Sort sort);

    @Query("SELECT r.name FROM Responsibility r WHERE r.id = :responsibilityId")
    Optional<String> findNameByResponsibilityId(@Param("responsibilityId") Long responsibilityId);
}
