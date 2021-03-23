package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = { "authorities", "invitations" })
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    List<User> findTop5ByEmailContainingIgnoreCaseOrLoginContainingIgnoreCase(String email, String login);

    @Query("SELECT u FROM User u LEFT JOIN u.invitations i WHERE i.project.id =:projectId")
    List<User> findAllByProjectId(@Param("projectId") long projectId, Sort sort);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);
}
