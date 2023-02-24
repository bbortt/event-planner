package io.github.bbortt.event.planner.apps.permissions.v1.rest;

import io.github.bbortt.event.planner.apps.permissions.v1.dto.ReadProjectIdsByMembership200ResponseDto;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;


import java.io.InputStream;
import java.util.Map;
import java.util.List;
import javax.validation.constraints.*;
import javax.validation.Valid;

@Path("/v1/projects")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-11-20T18:09:21.446513355+01:00[Europe/Zurich]")
public interface ProjectApi {

    @GET
    @Path("/{projectId}/permissions")
    Response hasAnyPermissionInProject(@QueryParam("permissions") @NotNull   List<String> permissions,@PathParam("projectId") Long projectId,@QueryParam("auth0UserId") @NotNull @Size(max=64)   String auth0UserId);

    @GET
    @Produces({ "application/json" })
    Response readProjectIdsByMembership(@QueryParam("auth0UserId") @Size(max=64)   String auth0UserId);
}
