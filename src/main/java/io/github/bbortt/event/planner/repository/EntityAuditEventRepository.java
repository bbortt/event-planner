package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.EntityAuditEvent;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data JPA repository for the EntityAuditEvent entity.
 */
public interface EntityAuditEventRepository extends JpaRepository<EntityAuditEvent, Long> {
    List<EntityAuditEvent> findAllByEntityTypeAndEntityId(String entityType, String entityId);

    @Query("SELECT max(a.commitVersion) FROM EntityAuditEvent a where a.entityType = :type and a.entityId = :entityId")
    Integer findMaxCommitVersion(@Param("type") String type, @Param("entityId") String entityId);

    @Query("SELECT DISTINCT (a.entityType) from EntityAuditEvent a")
    List<String> findAllEntityTypes();

    Page<EntityAuditEvent> findAllByEntityType(String entityType, Pageable pageRequest);

    @Query(
        "SELECT ae FROM EntityAuditEvent ae where ae.entityType = :type and ae.entityId = :entityId and " +
        "ae.commitVersion =(SELECT max(a.commitVersion) FROM EntityAuditEvent a where a.entityType = :type and " +
        "a.entityId = :entityId and a.commitVersion < :commitVersion)"
    )
    EntityAuditEvent findOneByEntityTypeAndEntityIdAndCommitVersion(
        @Param("type") String type,
        @Param("entityId") String entityId,
        @Param("commitVersion") Integer commitVersion
    );
}
