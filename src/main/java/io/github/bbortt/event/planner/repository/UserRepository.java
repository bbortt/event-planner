package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = { "authorities", "invitations" })
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = { "authorities", "invitations" })
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByLoginNot(Pageable pageable, String login);

    List<User> findDistinctTop10ByEmailContainingIgnoreCaseOrLoginContainingIgnoreCase(String email, String login);
}
