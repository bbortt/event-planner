package io.github.bbortt.event.planner.web.api;

import io.github.bbortt.event.planner.service.MemberService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectMembers200Response;
import io.github.bbortt.event.planner.service.api.dto.InviteMemberToProjectRequestInner;
import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.NotImplementedException;
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
    private final PaginationUtil paginationUtil;

    public ProjectMemberApiDelegateImpl(MemberService memberService, ProjectService projectService, PaginationUtil paginationUtil) {
        this.memberService = memberService;
        this.projectService = projectService;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public ResponseEntity<GetProjectMembers200Response> getProjectMembers(
        Long projectId,
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort
    ) {
        // TODO: This could be more performant with an "exists" check!
        if (projectService.findOne(projectId).isEmpty()) {
            logger.warn("REST request to get a page of Members in non-existent Project '{}'!", projectId);
            return ResponseEntity.notFound().build();
        }

        logger.debug("REST request to get a page of Members in Project '{}'", projectId);

        Page<MemberDTO> page = memberService.findInProject(
            projectId,
            paginationUtil.createPagingInformation(pageSize, pageNumber, sort, MEMBER_ID_ATTRIBUTE_NAME)
        );
        HttpHeaders headers = paginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(
            new GetProjectMembers200Response().contents(page.getContent().stream().map(this::memberFromMemberDto).toList()),
            headers,
            HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<Void> inviteMemberToProject(
        Long projectId,
        List<InviteMemberToProjectRequestInner> inviteMemberToProjectRequestInner
    ) {
        throw new NotImplementedException();
    }

    private Member memberFromMemberDto(MemberDTO memberDTO) {
        return new Member()
            .id(memberDTO.getId())
            .email(memberDTO.getInvitedEmail()) // TODO: Use user email if accepted
            .accepted(
                memberDTO.getAccepted()
            )//            .acceptedDate(LocalDateTime.ofInstant(memberDTO.getAcceptedDate(), ZoneId.systemDefault()).toLocalDate())
        //            .login(memberDTO.getLogin())
        //            .firstName()
        ;
    }
}
