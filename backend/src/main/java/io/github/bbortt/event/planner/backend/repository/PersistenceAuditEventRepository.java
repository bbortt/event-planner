package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.PersistentAuditEvent;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link PersistentAuditEvent} entity.
 */
public interface PersistenceAuditEventRepository extends JpaRepository<PersistentAuditEvent, Long> {
    List<PersistentAuditEvent> findByPrincipal(String principal);

    List<PersistentAuditEvent> findByPrincipalAndAuditEventDateAfterAndAuditEventType(String principal, Instant after, String type);

    Page<PersistentAuditEvent> findAllByAuditEventDateBetween(ZonedDateTime fromDate, ZonedDateTime toDate, Pageable pageable);

    List<PersistentAuditEvent> findByAuditEventDateBefore(ZonedDateTime before);
}
