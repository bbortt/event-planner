package io.github.bbortt.event.planner.service.user.repository;

import io.github.bbortt.event.planner.service.user.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
