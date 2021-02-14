package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import java.util.Optional;
import javax.validation.constraints.NotNull;
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
    @Query(
        value = "select p from Project p" +
        " left join Invitation i" +
        "  on p = i.project" +
        " left join User u" +
        "  on i.user = u" +
        "    where u.login = :currentUserLogin",
        countQuery = "select count(i.id) from Invitation i" +
        " left join User u" +
        "  on i.user = u" +
        "    where u.login = :currentUserLogin"
    )
    Page<Project> findMine(@NotNull @Param("currentUserLogin") String currentUserLogin, Pageable pageable);

    @Query("SELECT p.name FROM Project p WHERE p.id = :projectId")
    Optional<String> findNameByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query("UPDATE Project p SET p.archived = true WHERE p.id = :projectId")
    void archive(@Param("projectId") Long projectId);
}
