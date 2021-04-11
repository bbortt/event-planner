package io.github.bbortt.event.planner.service.user.repository;

import io.github.bbortt.event.planner.service.user.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findOneByLogin(String login);

    List<User> findTop5ByEmailContainingIgnoreCaseOrLoginContainingIgnoreCase(String email, String login);
}
