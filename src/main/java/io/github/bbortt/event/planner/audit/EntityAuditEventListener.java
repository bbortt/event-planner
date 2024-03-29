package io.github.bbortt.event.planner.audit;

import io.github.bbortt.event.planner.domain.enumeration.EntityAuditAction;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

public class EntityAuditEventListener extends AuditingEntityListener {

    private static final Logger logger = LoggerFactory.getLogger(EntityAuditEventListener.class);

    private static EntityAuditEventWriter entityAuditEventWriter;

    @PostPersist
    public void onPostCreate(Object target) {
        writeEvent(target, EntityAuditAction.CREATE);
    }

    @PostUpdate
    public void onPostUpdate(Object target) {
        writeEvent(target, EntityAuditAction.UPDATE);
    }

    @PostRemove
    public void onPostRemove(Object target) {
        writeEvent(target, EntityAuditAction.DELETE);
    }

    public void writeEvent(Object target, EntityAuditAction action) {
        if (entityAuditEventWriter == null) {
            throw new RuntimeException("AsyncEntityAuditEventWriter instance is not set");
        }
        try {
            entityAuditEventWriter.writeAuditEvent(target, action);
        } catch (Exception e) {
            logger.error("Exception while persisting delete audit entity {}", e);
        }
    }

    static void setEntityAuditEventWriter(EntityAuditEventWriter entityAuditEventWriter) {
        EntityAuditEventListener.entityAuditEventWriter = entityAuditEventWriter;
    }

    @Configuration
    static class AuditConfig {

        public AuditConfig(EntityAuditEventWriter entityAuditEventWriter) {
            EntityAuditEventListener.entityAuditEventWriter = entityAuditEventWriter;
        }
    }
}
