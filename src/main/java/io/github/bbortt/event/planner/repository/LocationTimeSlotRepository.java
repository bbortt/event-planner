package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.LocationTimeSlot;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the LocationTimeSlot entity.
 */
@Repository
public interface LocationTimeSlotRepository extends JpaRepository<LocationTimeSlot, Long> {}
