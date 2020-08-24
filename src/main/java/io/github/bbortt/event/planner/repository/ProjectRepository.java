package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Project entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query(
        nativeQuery = true,
        value = "select p.* from project p" +
        " left join invitation i" +
        "  on p.id = i.project_id" +
        " left join jhi_user u" +
        "  on i.jhi_user_id = u.id" +
        "    where u.login = :currentUserLogin",
        countQuery = "select count(i.id) from invitation i" +
        " left join jhi_user u" +
        "  on i.jhi_user_id = u.id" +
        "    where u.login = :currentUserLogin"
    )
    Page<Project> findMine(@Param("currentUserLogin") String currentUserLogin, Pageable pageable);
}
