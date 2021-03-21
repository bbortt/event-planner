package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.LocationTimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the LocationTimeSlot entity.
 */
@Repository
public interface LocationTimeSlotRepository extends JpaRepository<LocationTimeSlot, Long> {}
