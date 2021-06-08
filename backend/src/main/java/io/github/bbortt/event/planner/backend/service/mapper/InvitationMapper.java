package io.github.bbortt.event.planner.backend.service.mapper;

import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.service.UserService;
import io.github.bbortt.event.planner.backend.service.dto.InvitationDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class InvitationMapper {

    private final UserService userService;

    public InvitationMapper(UserService userService) {
        this.userService = userService;
    }

    public InvitationDTO dtoFromInvitation(Invitation invitation) {
        if (invitation == null) {
            return null;
        } else {
            UserDTO user = Optional
                .ofNullable(invitation.getJhiUserId())
                .map(userService::getById)
                .orElseThrow(IllegalArgumentException::new);

            InvitationDTO invitationDTO = new InvitationDTO();
            invitationDTO.setId(invitation.getId());
            invitationDTO.setEmail(invitation.getEmail());
            invitationDTO.setAccepted(invitation.isAccepted());
            invitationDTO.setToken(invitation.getToken());
            invitationDTO.setColor(invitation.getColor());
            invitationDTO.setProject(invitation.getProject());
            invitationDTO.setRole(invitation.getRole());
            invitationDTO.setResponsibility(invitation.getResponsibility());
            invitationDTO.setUser(user);
            return invitationDTO;
        }
    }

    public Invitation invitationFromDTO(InvitationDTO invitationDTO) {
        if (invitationDTO == null) {
            return null;
        } else {
            Invitation invitation = new Invitation()
                .id(invitationDTO.getId())
                .email(invitationDTO.getEmail())
                .accepted(invitationDTO.getAccepted())
                .token(invitationDTO.getToken())
                .color(invitationDTO.getColor())
                .project(invitationDTO.getProject())
                .role(invitationDTO.getRole())
                .responsibility(invitationDTO.getResponsibility());

            if (invitationDTO.getUser() != null) {
                invitation.setJhiUserId(invitationDTO.getUser().getId());
            }

            return invitation;
        }
    }
}
