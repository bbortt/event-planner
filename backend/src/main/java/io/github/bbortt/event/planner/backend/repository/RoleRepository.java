package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.domain.Role;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    @Query("FROM Role r WHERE r.name = io.github.bbortt.event.planner.backend.security.RolesConstants.ADMIN")
    Role roleAdmin();

    @Query("FROM Role r WHERE r.name = io.github.bbortt.event.planner.backend.security.RolesConstants.SECRETARY")
    Role roleSecretary();

    @Query("FROM Role r WHERE r.name = io.github.bbortt.event.planner.backend.security.RolesConstants.CONTRIBUTOR")
    Role roleContributor();

    @Query("FROM Role r WHERE r.name = io.github.bbortt.event.planner.backend.security.RolesConstants.VIEWER")
    Role roleViewer();

    @Query(
        "SELECT CASE WHEN COUNT(i) > 0 THEN TRUE ELSE FALSE END FROM Invitation i" +
        " WHERE i.accepted = true" +
        "  AND i.project = :project" +
        "  AND i.user.login = :currentUserLogin" +
        "  AND i.role.name in :roles"
    )
    boolean hasAnyRoleInProject(
        @Param("project") Project project,
        @Param("currentUserLogin") String currentUserLogin,
        @Param("roles") List<String> roles
    );
}
