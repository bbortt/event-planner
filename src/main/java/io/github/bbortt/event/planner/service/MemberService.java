package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.mail.MailService;
import io.github.bbortt.event.planner.repository.MemberRepository;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.mapper.MemberMapper;
import io.github.bbortt.event.planner.service.mapper.ProjectMapper;
import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Member}.
 */
@Service
public class MemberService {

    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    private final MemberRepository memberRepository;

    private final MemberMapper memberMapper;
    private final ProjectMapper projectMapper;
    private final MailService mailService;

    public MemberService(
        MemberRepository memberRepository,
        MemberMapper memberMapper,
        ProjectMapper projectMapper,
        MailService mailService
    ) {
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
        this.projectMapper = projectMapper;
        this.mailService = mailService;
    }

    /**
     * Save a member.
     *
     * @param memberDTO the entity to save.
     * @return the persisted entity.
     */
    @Modifying
    @Transactional
    public MemberDTO save(MemberDTO memberDTO) {
        logger.debug("Request to save Member : {}", memberDTO);
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
    @Modifying
    @Transactional
    public MemberDTO update(MemberDTO memberDTO) {
        logger.debug("Request to update Member : {}", memberDTO);
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
    @Modifying
    @Transactional
    public Optional<MemberDTO> partialUpdate(MemberDTO memberDTO) {
        logger.debug("Request to partially update Member : {}", memberDTO);

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
        logger.debug("Request to get all Members");
        return memberRepository.findAll(pageable).map(memberMapper::toDto);
    }

    /**
     * Get all the members with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
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
        logger.debug("Request to get Member : {}", id);
        return memberRepository.findOneWithEagerRelationships(id).map(memberMapper::toDto);
    }

    /**
     * Delete the member by id.
     *
     * @param id the id of the entity.
     */
    @Modifying
    @Transactional
    public void delete(Long id) {
        logger.debug("Request to delete Member : {}", id);
        memberRepository.deleteById(id);
    }

    /**
     * Get all members of a {@link io.github.bbortt.event.planner.domain.Project}.
     *
     * @param projectId the id of the {@link io.github.bbortt.event.planner.domain.Project}.
     * @param pageable the pagination information.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public Page<MemberDTO> findAllInProject(Long projectId, Pageable pageable) {
        logger.debug("Request to get a page of Members in Project '{}'", projectId);
        return memberRepository.findAllByProjectIdEquals(projectId, pageable).map(memberMapper::toDto);
    }

    /**
     * Get one member in a {@link io.github.bbortt.event.planner.domain.Project} by invitation email.
     *
     * @param projectId the id of the {@link io.github.bbortt.event.planner.domain.Project}.
     * @param invitedEmail the invitation email of the entity.
     *
     * @return the entity.
     */
    public Optional<MemberDTO> findOneInProjectByInvitationEmail(Long projectId, String invitedEmail) {
        logger.debug("Request to get Member with email '{}' in Project '{}'", invitedEmail, projectId);
        return memberRepository.findMemberInProject(invitedEmail, projectId).map(memberMapper::toDto);
    }

    /**
     * Invite a member to collaborate on a {@link io.github.bbortt.event.planner.domain.Project}.
     *
     * @param email the invitation email of the entity.
     * @param project the {@link io.github.bbortt.event.planner.domain.Project} to collaborate on.
     *
     * @return the persisted entity.
     */
    @Modifying
    @Transactional
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public MemberDTO inviteToProject(String email, @Nonnull ProjectDTO project) {
        logger.debug("Request to invite Member '{}' to Project '{}'", email, project);

        MemberDTO memberDTO = memberMapper.toDto(
            memberRepository.save(new Member().accepted(Boolean.FALSE).invitedEmail(email).project(projectMapper.toEntity(project)))
        );

        memberDTO.setProject(project);
        mailService.sendProjectInvitationEmail(memberDTO);

        return memberDTO;
    }
}
