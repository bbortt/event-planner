package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.EventHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventHistoryRepository extends JpaRepository<EventHistory, Long> {}
