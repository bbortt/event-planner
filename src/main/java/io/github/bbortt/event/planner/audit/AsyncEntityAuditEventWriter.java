package io.github.bbortt.event.planner.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bbortt.event.planner.domain.AbstractAuditingEntity;
import io.github.bbortt.event.planner.domain.EntityAuditEvent;
import io.github.bbortt.event.planner.domain.enumeration.EntityAuditAction;
import io.github.bbortt.event.planner.repository.EntityAuditEventRepository;
import java.io.IOException;
import java.lang.reflect.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.convert.ConversionService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Async Entity Audit Event writer
 * This is invoked by Hibernate entity listeners to write audit event for entities
 */
@Component
@Profile("!testdev & !testprod")
public class AsyncEntityAuditEventWriter implements EntityAuditEventWriter {

    private final Logger log = LoggerFactory.getLogger(AsyncEntityAuditEventWriter.class);

    private final EntityAuditEventRepository auditingEntityRepository;

    private final ObjectMapper objectMapper; //Jackson object mapper

    private final ConversionService conversionService;

    public AsyncEntityAuditEventWriter(
        EntityAuditEventRepository auditingEntityRepository,
        ObjectMapper objectMapper,
        ConversionService conversionService
    ) {
        this.auditingEntityRepository = auditingEntityRepository;
        this.objectMapper = objectMapper;
        this.conversionService = conversionService;
    }

    /**
     * Writes audit events to DB asynchronously in a new thread
     */
    @Async
    public void writeAuditEvent(Object target, EntityAuditAction action) {
        log.debug("-------------- Post {} audit  --------------", action.value());
        try {
            EntityAuditEvent auditedEntity = prepareAuditEntity(target, action);
            if (auditedEntity != null) {
                auditingEntityRepository.save(auditedEntity);
            }
        } catch (Exception e) {
            log.error("Exception while persisting audit entity for {} error: {}", target, e);
        }
    }

    /**
     * Method to prepare auditing entity
     *
     * @param entity
     * @param action
     * @return
     */
    private EntityAuditEvent prepareAuditEntity(final Object entity, EntityAuditAction action) {
        EntityAuditEvent auditedEntity = new EntityAuditEvent();
        Class<?> entityClass = entity.getClass(); // Retrieve entity class with reflection
        auditedEntity.setAction(action.value());
        auditedEntity.setEntityType(entityClass.getName());
        Object entityId;
        String entityData;
        log.trace("Getting Entity Id and Content");
        try {
            Field privateLongField = entityClass.getDeclaredField("id");
            privateLongField.setAccessible(true);
            entityId = (Object) privateLongField.get(entity);
            privateLongField.setAccessible(false);
            entityData = objectMapper.writeValueAsString(entity);
        } catch (IllegalArgumentException | IllegalAccessException | NoSuchFieldException | SecurityException | IOException e) {
            log.error("Exception while getting entity ID and content {}", e);
            // returning null as we don't want to raise an application exception here
            return null;
        }
        auditedEntity.setEntityId(conversionService.convert(entityId, String.class));
        auditedEntity.setEntityValue(entityData);
        final AbstractAuditingEntity abstractAuditEntity = (AbstractAuditingEntity) entity;
        if (EntityAuditAction.CREATE.equals(action)) {
            auditedEntity.setModifiedBy(abstractAuditEntity.getCreatedBy());
            auditedEntity.setModifiedDate(abstractAuditEntity.getCreatedDate());
            auditedEntity.setCommitVersion(1);
        } else {
            auditedEntity.setModifiedBy(abstractAuditEntity.getLastModifiedBy());
            auditedEntity.setModifiedDate(abstractAuditEntity.getLastModifiedDate());
            calculateVersion(auditedEntity);
        }
        log.trace("Audit Entity --> {} ", auditedEntity.toString());
        return auditedEntity;
    }

    private void calculateVersion(EntityAuditEvent auditedEntity) {
        log.trace("Version calculation. for update/remove");
        Integer lastCommitVersion = auditingEntityRepository.findMaxCommitVersion(
            auditedEntity.getEntityType(),
            auditedEntity.getEntityId()
        );
        log.trace("Last commit version of entity => {}", lastCommitVersion);
        if (lastCommitVersion != null && lastCommitVersion != 0) {
            log.trace("Present. Adding version..");
            auditedEntity.setCommitVersion(lastCommitVersion + 1);
        } else {
            log.trace("No entities.. Adding new version 1");
            auditedEntity.setCommitVersion(1);
        }
    }
}
