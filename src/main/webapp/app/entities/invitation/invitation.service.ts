import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IInvitation } from 'app/shared/model/invitation.model';

type EntityResponseType = HttpResponse<IInvitation>;
type EntityArrayResponseType = HttpResponse<IInvitation[]>;

@Injectable({ providedIn: 'root' })
export class InvitationService {
  public resourceUrl = SERVER_API_URL + 'api/invitations';

  constructor(protected http: HttpClient) {}

  create(invitation: IInvitation): Observable<EntityResponseType> {
    return this.http.post<IInvitation>(this.resourceUrl, invitation, { observe: 'response' });
  }

  update(invitation: IInvitation): Observable<EntityResponseType> {
    return this.http.put<IInvitation>(this.resourceUrl, invitation, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInvitation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInvitation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
