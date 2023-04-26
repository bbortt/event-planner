package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Project entity.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query(
        "SELECT DISTINCT p FROM Project p " +
        "LEFT JOIN Member m ON m.project.id = p.id " +
        "  WHERE p.archived = false " +
        "    AND (" +
        "      p.createdBy = :username " +
        "      OR (" +
        "        m.acceptedBy = :username " +
        "        AND m.accepted = true" +
        "      )" +
        "    )"
    )
    Slice<Project> findByUsernameParticipatingIn(@Param("username") String username, Pageable pageable);

    Optional<Project> findByToken(@Param("token") UUID token);
}
