package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Role entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    @Query("FROM Role r where r.name = io.github.bbortt.event.planner.security.RolesConstants.ADMIN")
    public Role roleAdmin();
}
