package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.MemberService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectMembers200Response;
import io.github.bbortt.event.planner.service.api.dto.InviteMemberToProjectRequestInner;
import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectMemberMapper;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

@RestController
public class ProjectMemberApiDelegateImpl implements ProjectMemberApiDelegate {

    private final Logger log = LoggerFactory.getLogger(ProjectMemberApiDelegateImpl.class);

    private static final String MEMBER_ID_ATTRIBUTE_NAME = "id";

    private final MemberService memberService;
    private final ProjectService projectService;
    private final ApiProjectMemberMapper apiProjectMemberMapper;
    private final PaginationUtil paginationUtil;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ProjectMemberApiDelegateImpl(
        MemberService memberService,
        ProjectService projectService,
        ApiProjectMemberMapper apiProjectMemberMapper,
        PaginationUtil paginationUtil
    ) {
        this.memberService = memberService;
        this.projectService = projectService;
        this.apiProjectMemberMapper = apiProjectMemberMapper;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public ResponseEntity<Member> findProjectMemberByTokenAndEmail(Long projectId, String invitationEmail) {
        log.debug("REST request to get Member with email '{}' in Project '{}'", invitationEmail, projectId);

        getProjectByIdOrThrowBadRequestAlertException(projectId);

        return ResponseUtil.wrapOrNotFound(
            memberService.findOneInProjectByInvitationEmail(projectId, invitationEmail).map(apiProjectMemberMapper::toApiDTO)
        );
    }

    @Override
    public ResponseEntity<GetProjectMembers200Response> getProjectMembers(
        Long projectId,
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        log.debug("REST request to get a page of Members in Project '{}'", projectId);

        getProjectByIdOrThrowBadRequestAlertException(projectId);

        Page<MemberDTO> page = memberService.findAllInProject(
            projectId,
            paginationUtil.createPagingInformation(pageSize, pageNumber, sort, MEMBER_ID_ATTRIBUTE_NAME)
        );
        HttpHeaders headers = paginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(
            new GetProjectMembers200Response().contents(page.getContent().stream().map(this::toApiDTO).toList()),
            headers,
            HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<GetProjectMembers200Response> inviteMemberToProject(
        Long projectId,
        List<InviteMemberToProjectRequestInner> inviteMemberToProjectRequestInner
    ) {
        log.debug("REST request to invite new Members '{}' to Project '{}'", inviteMemberToProjectRequestInner, projectId);

        ProjectDTO project = getProjectByIdOrThrowBadRequestAlertException(projectId);

        return ResponseEntity
            .created(createProjectMembersUri(projectId))
            .headers(HeaderUtil.createAlert(applicationName, "member.invited", ""))
            .body(
                new GetProjectMembers200Response()
                    .contents(
                        inviteMemberToProjectRequestInner
                            .stream()
                            .map(InviteMemberToProjectRequestInner::getEmail)
                            .map(email -> memberService.inviteToProject(email, project))
                            .map(apiProjectMemberMapper::toApiDTO)
                            .toList()
                    )
            );
    }

    private ProjectDTO getProjectByIdOrThrowBadRequestAlertException(Long projectId) {
        Optional<ProjectDTO> project = projectService.findOne(projectId);

        if (project.isEmpty()) {
            log.warn("REST request for Members in non-existent Project '{}'!", projectId);
            throw new BadRequestAlertException("Entity not found", ProjectApiDelegateImpl.ENTITY_NAME, "idnotfound");
        }

        return project.get();
    }

    private static URI createProjectMembersUri(Long projectId) {
        URI entitiesUri;

        try {
            entitiesUri = new URI(String.format("home/projects/%s/admin/members", projectId));
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException(e);
        }

        return entitiesUri;
    }

    private Member toApiDTO(MemberDTO memberDTO) {
        Member member = apiProjectMemberMapper.toApiDTO(memberDTO);

        if (!Objects.isNull(memberDTO.getUser()) && StringUtils.isNoneBlank(memberDTO.getUser().getEmail())) {
            member.setEmail(memberDTO.getUser().getEmail());
        }

        return member;
    }
}
