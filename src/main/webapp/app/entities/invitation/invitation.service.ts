import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { Invitation } from 'app/shared/model/invitation.model';

import { createRequestOption } from 'app/shared/util/request-util';

import { SERVER_API_URL } from 'app/app.constants';

type EntityResponseType = HttpResponse<Invitation>;
type EntityArrayResponseType = HttpResponse<Invitation[]>;

@Injectable({ providedIn: 'root' })
export class InvitationService {
  public resourceUrl = SERVER_API_URL + 'api/invitations';

  constructor(protected http: HttpClient) {}

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
    return this.http.post<void>(`${this.resourceUrl}/user/${login}`, token);
  }

  assignCurrentUserToInvitation(token: string): Observable<void> {
    return this.http.post<void>(`${this.resourceUrl}/user`, token);
  }

  checkTokenValidity(token: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/token-validity`, token);
  }
}
