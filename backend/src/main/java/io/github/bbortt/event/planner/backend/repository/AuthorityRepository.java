package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
