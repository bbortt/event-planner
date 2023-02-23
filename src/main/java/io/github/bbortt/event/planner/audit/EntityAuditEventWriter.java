package io.github.bbortt.event.planner.audit;

import io.github.bbortt.event.planner.domain.enumeration.EntityAuditAction;

@FunctionalInterface
public interface EntityAuditEventWriter {
    public void writeAuditEvent(Object target, EntityAuditAction action);
}
