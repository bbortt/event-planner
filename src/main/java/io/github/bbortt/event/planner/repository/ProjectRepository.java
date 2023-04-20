package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Project entity.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Slice<Project> findAllByCreatedByEqualsAndArchivedIsFalse(@Param("createdBy") String createdBy, Pageable pageable);

    Optional<Project> findByToken(@Param("token") String token);
}
