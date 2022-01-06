package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Locality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, Long> {}
