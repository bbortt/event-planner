package io.github.bbortt.event.planner.web.api.mapper;

import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import java.time.Instant;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApiProjectMemberMapper {
    TimeUtils timeUtils = new TimeUtils();

    @Mapping(target = "email", source = "invitedEmail")
    @Mapping(target = "login", source = "user.login")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "imageUrl", source = "user.imageUrl")
    Member toApiDTO(MemberDTO entity);

    default OffsetDateTime map(Instant instant) {
        return timeUtils.toOffsetDateTime(instant);
    }
}
