package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Project;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Project entity.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findAllByArchived(@Param("archived") boolean archived, Pageable pageable);

    @Query(
        value = "select p from Project p" +
        " left join Invitation i" +
        "  on p = i.project" +
        "    where p.archived = :archived" +
        "    and i.jhiUserId = :jhiUserId",
        countQuery = "select count(p.id) from Project p" +
        " left join Invitation i" +
        "  on p = i.project" +
        "    where p.archived = :archived" +
        "    and i.jhiUserId = :jhiUserId"
    )
    Page<Project> findMineByArchived(@Param("jhiUserId") String jhiUserId, @Param("archived") boolean archived, Pageable pageable);

    @Query("SELECT p.name FROM Project p WHERE p.id = :projectId")
    Optional<String> findNameByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("UPDATE Project p SET p.archived = true WHERE p.id = :projectId")
    int archive(@Param("projectId") Long projectId);
}
