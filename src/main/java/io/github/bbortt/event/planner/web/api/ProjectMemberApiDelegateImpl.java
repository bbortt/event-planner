package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.MemberService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectMembers200Response;
import io.github.bbortt.event.planner.service.api.dto.InviteMemberToProjectRequestInner;
import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectMemberMapper;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
public class ProjectMemberApiDelegateImpl implements ProjectMemberApiDelegate {

    private final Logger logger = LoggerFactory.getLogger(ProjectApiDelegateImpl.class);

    private static final String MEMBER_ID_ATTRIBUTE_NAME = "id";

    private final MemberService memberService;
    private final ProjectService projectService;
    private final ApiProjectMemberMapper apiProjectMemberMapper;
    private final PaginationUtil paginationUtil;

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
    public ResponseEntity<GetProjectMembers200Response> getProjectMembers(
        Long projectId,
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        if (!projectService.exists(projectId)) {
            logger.warn("REST request to get a page of Members in non-existent Project '{}'!", projectId);
            // TODO: This should throw a more understandable error message using a `ResponseEntity<Problem>`!
            return ResponseEntity.notFound().build();
        }

        logger.debug("REST request to get a page of Members in Project '{}'", projectId);

        Page<MemberDTO> page = memberService.findInProject(
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

    private Member toApiDTO(MemberDTO memberDTO) {
        Member member = apiProjectMemberMapper.toApiDTO(memberDTO);
        if (!Objects.isNull(memberDTO.getUser()) && StringUtils.isNoneBlank(memberDTO.getUser().getEmail())) {
            member.setEmail(memberDTO.getUser().getEmail());
        }
        return member;
    }

    @Override
    public ResponseEntity<Void> inviteMemberToProject(
        Long projectId,
        List<InviteMemberToProjectRequestInner> inviteMemberToProjectRequestInner
    ) {
        throw new NotImplementedException();
    }
}
