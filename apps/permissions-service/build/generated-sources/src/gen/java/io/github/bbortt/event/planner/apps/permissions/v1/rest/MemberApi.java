package io.github.bbortt.event.planner.apps.permissions.v1.rest;


import javax.ws.rs.*;
import javax.ws.rs.core.Response;


import java.io.InputStream;
import java.util.Map;
import java.util.List;
import javax.validation.constraints.*;
import javax.validation.Valid;

@Path("/v1/members")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-11-20T18:09:21.446513355+01:00[Europe/Zurich]")
public interface MemberApi {

    @POST
    Response createAdminMemberInProject(@QueryParam("auth0UserId") @NotNull @Size(max=64)   String auth0UserId,@QueryParam("projectId") @NotNull   Long projectId);
}
