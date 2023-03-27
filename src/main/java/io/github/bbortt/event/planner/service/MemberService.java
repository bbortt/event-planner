package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.mapper.MemberMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Member}.
 */
@Service
@Transactional
public class MemberService {

    private final Logger log = LoggerFactory.getLogger(MemberService.class);

    private final MemberRepository memberRepository;

    private final MemberMapper memberMapper;

    public MemberService(MemberRepository memberRepository, MemberMapper memberMapper) {
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
    }

    /**
     * Save a member.
     *
     * @param memberDTO the entity to save.
     * @return the persisted entity.
     */
    public MemberDTO save(MemberDTO memberDTO) {
        log.debug("Request to save Member : {}", memberDTO);
        Member member = memberMapper.toEntity(memberDTO);

        // Sanitize new membership
        member.accepted(Boolean.FALSE);

        return memberMapper.toDto(memberRepository.save(member));
    }

    /**
     * Update a member.
     *
     * @param memberDTO the entity to save.
     * @return the persisted entity.
     */
    public MemberDTO update(MemberDTO memberDTO) {
        log.debug("Request to update Member : {}", memberDTO);
        Member member = memberMapper.toEntity(memberDTO);
        member = memberRepository.save(member);
        return memberMapper.toDto(member);
    }

    /**
     * Partially update a member.
     *
     * @param memberDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<MemberDTO> partialUpdate(MemberDTO memberDTO) {
        log.debug("Request to partially update Member : {}", memberDTO);

        return memberRepository
            .findById(memberDTO.getId())
            .map(existingMember -> {
                memberMapper.partialUpdate(existingMember, memberDTO);

                return existingMember;
            })
            .map(memberRepository::save)
            .map(memberMapper::toDto);
    }

    /**
     * Get all the members.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<MemberDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Members");
        return memberRepository.findAll(pageable).map(memberMapper::toDto);
    }

    /**
     * Get all the members with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<MemberDTO> findAllWithEagerRelationships(Pageable pageable) {
        return memberRepository.findAllWithEagerRelationships(pageable).map(memberMapper::toDto);
    }

    /**
     * Get one member by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MemberDTO> findOne(Long id) {
        log.debug("Request to get Member : {}", id);
        return memberRepository.findOneWithEagerRelationships(id).map(memberMapper::toDto);
    }

    /**
     * Delete the member by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Member : {}", id);
        memberRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public Page<MemberDTO> findInProject(Long projectId, Pageable pageable) {
        log.debug("Request to get a page of Members in Project '{}'", projectId);
        return memberRepository.findAllByProjectIdEquals(projectId, pageable).map(memberMapper::toDto);
    }
}
