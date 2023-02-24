package io.github.bbortt.event.planner.apps.permissions.v1.rest;

import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;


import java.io.InputStream;
import java.util.Map;
import java.util.List;
import javax.validation.constraints.*;
import javax.validation.Valid;

@Path("/v1/permissions")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-11-20T18:09:21.446513355+01:00[Europe/Zurich]")
public interface PermissionApi {

    @PUT
    @Path("/{permission}")
    Response grantPermissionInProject(@PathParam("permission") @Size(max=20) String permission,@QueryParam("auth0UserId") @NotNull @Size(max=64)   String auth0UserId,@QueryParam("projectId") @NotNull   Long projectId,@QueryParam("callingAuth0UserId") @NotNull @Size(max=64)   String callingAuth0UserId);

    @GET
    @Produces({ "application/json" })
    Response readPermissionsByUserAndProject(@QueryParam("auth0UserId") @NotNull @Size(max=64)   String auth0UserId,@QueryParam("projectId") @NotNull   Long projectId);

    @DELETE
    @Path("/{permission}")
    Response revokePermissionInProject(@PathParam("permission") @Size(max=20) String permission,@QueryParam("auth0UserId") @NotNull @Size(max=64)   String auth0UserId,@QueryParam("projectId") @NotNull   Long projectId,@QueryParam("callingAuth0UserId") @NotNull @Size(max=64)   String callingAuth0UserId);
}
