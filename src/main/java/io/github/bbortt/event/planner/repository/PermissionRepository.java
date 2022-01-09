package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Permission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {
  @Query(
    "select case when count(m) > 0 then true else false end from Member m left join m.permissions p where m.auth0User.userId = :auth0UserSub and m.project.id = :projectId and p.permission.id IN :permissions"
  )
  Boolean auth0UserHasProjectPermission(
    @Param("auth0UserSub") String auth0UserSub,
    @Param("projectId") Long projectId,
    @Param("permissions") List<String> permissions
  );
}
