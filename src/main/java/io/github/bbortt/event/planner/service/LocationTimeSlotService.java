package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.LocationTimeSlot;
import io.github.bbortt.event.planner.repository.LocationTimeSlotRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link LocationTimeSlot}.
 */
@Service
public class LocationTimeSlotService {

    private final Logger log = LoggerFactory.getLogger(LocationTimeSlotService.class);

    private final LocationTimeSlotRepository locationTimeSlotRepository;

    public LocationTimeSlotService(LocationTimeSlotRepository locationTimeSlotRepository) {
        this.locationTimeSlotRepository = locationTimeSlotRepository;
    }

    /**
     * Save a locationTimeSlot.
     *
     * @param locationTimeSlot the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public LocationTimeSlot save(LocationTimeSlot locationTimeSlot) {
        log.debug("Request to save LocationTimeSlot : {}", locationTimeSlot);
        return locationTimeSlotRepository.save(locationTimeSlot);
    }

    /**
     * Get all the locationTimeSlots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<LocationTimeSlot> findAll(Pageable pageable) {
        log.debug("Request to get all LocationTimeSlots");
        return locationTimeSlotRepository.findAll(pageable);
    }

    /**
     * Get one locationTimeSlot by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LocationTimeSlot> findOne(Long id) {
        log.debug("Request to get LocationTimeSlot : {}", id);
        return locationTimeSlotRepository.findById(id);
    }

    /**
     * Delete the locationTimeSlot by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete LocationTimeSlot : {}", id);
        locationTimeSlotRepository.deleteById(id);
    }
}
