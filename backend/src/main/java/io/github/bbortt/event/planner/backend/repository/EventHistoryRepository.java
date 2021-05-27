package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.domain.Project;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventHistoryRepository extends JpaRepository<EventHistory, Long> {
    void deleteAllByProjectId(Long projectId);

    @Query("SELECT p FROM EventHistory h JOIN Project p on h.projectId = p.id WHERE h.id = :projectId ")
    Optional<Project> findProjectById(@Param("projectId") Long projectId);

    Page<EventHistory> findAllByProjectId(Long projectId, Pageable pageable);

    Page<EventHistory> findAllByProjectIdAndCreatedDateGreaterThanEqual(Long projectId, ZonedDateTime createdDate, Pageable pageable);
}
