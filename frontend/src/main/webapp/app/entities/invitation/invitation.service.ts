import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Invitation } from 'app/entities/invitation/invitation.model';
import { Project } from 'app/entities/project/project.model';

type EntityResponseType = HttpResponse<Invitation>;
type EntityArrayResponseType = HttpResponse<Invitation[]>;

@Injectable({ providedIn: 'root' })
export class InvitationService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/invitations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(invitation: Invitation): Observable<EntityResponseType> {
    return this.http.post<Invitation>(this.resourceUrl, invitation, { observe: 'response' });
  }

  update(invitation: Invitation): Observable<EntityResponseType> {
    return this.http.put<Invitation>(this.resourceUrl, invitation, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Invitation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Invitation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllByProjectId(projectId: number, req?: any): Observable<HttpResponse<Invitation[]>> {
    const options = createRequestOption(req);
    return this.http.get<Invitation[]>(`${this.resourceUrl}/project/${projectId}`, { params: options, observe: 'response' });
  }

  assignUserByLoginToInvitation(login: string, token: string): Observable<void> {
    return this.http.post<void>(`${this.resourceUrl}/accept/${login}`, token);
  }

  assignCurrentUserToInvitation(token: string): Observable<void> {
    return this.http.post<void>(`${this.resourceUrl}/accept`, token);
  }

  checkTokenValidity(token: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/token-validity`, token);
  }

  emailExistsInProject(project: Project, email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/project/${project.id!}/email-exists`, email);
  }
}
