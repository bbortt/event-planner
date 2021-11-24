package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Auth0User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Auth0UserRepository extends JpaRepository<Auth0User, String> {}
