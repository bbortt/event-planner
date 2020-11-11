package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.Role;
import java.util.List;
import javax.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    @Query("from Role r where r.name = io.github.bbortt.event.planner.security.RolesConstants.ADMIN")
    public Role roleAdmin();

    @Query(
        "select case when count(i) > 0 then true else false end from Invitation i" +
        " where i.accepted = true" +
        "  and i.project = :project" +
        "  and i.user.login = :currentUserLogin" +
        "  and i.role.name in :roles"
    )
    public boolean hasAnyRoleInProject(
        @NotNull @Param("project") Project project,
        @NotNull @Param("currentUserLogin") String currentUserLogin,
        @NotNull @Param("roles") List<String> roles
    );
}
