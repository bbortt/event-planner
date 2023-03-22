import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMember, NewMember } from '../member.model';

export type PartialUpdateMember = Partial<IMember> & Pick<IMember, 'id'>;

type RestOf<T extends IMember | NewMember> = Omit<T, 'acceptedDate'> & {
  acceptedDate?: string | null;
};

export type RestMember = RestOf<IMember>;

export type NewRestMember = RestOf<NewMember>;

export type PartialUpdateRestMember = RestOf<PartialUpdateMember>;

export type EntityResponseType = HttpResponse<IMember>;
export type EntityArrayResponseType = HttpResponse<IMember[]>;

@Injectable({ providedIn: 'root' })
export class MemberService {
  protected resourceUrl;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/members');
  }

  create(member: NewMember): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(member);
    return this.http
      .post<RestMember>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(member: IMember): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(member);
    return this.http
      .put<RestMember>(`${this.resourceUrl}/${this.getMemberIdentifier(member)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(member: PartialUpdateMember): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(member);
    return this.http
      .patch<RestMember>(`${this.resourceUrl}/${this.getMemberIdentifier(member)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMember>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMember[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMemberIdentifier(member: Pick<IMember, 'id'>): number {
    return member.id;
  }

  compareMember(o1: Pick<IMember, 'id'> | null, o2: Pick<IMember, 'id'> | null): boolean {
    return o1 && o2 ? this.getMemberIdentifier(o1) === this.getMemberIdentifier(o2) : o1 === o2;
  }

  addMemberToCollectionIfMissing<Type extends Pick<IMember, 'id'>>(
    memberCollection: Type[],
    ...membersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const members: Type[] = membersToCheck.filter(isPresent);
    if (members.length > 0) {
      const memberCollectionIdentifiers = memberCollection.map(memberItem => this.getMemberIdentifier(memberItem)!);
      const membersToAdd = members.filter(memberItem => {
        const memberIdentifier = this.getMemberIdentifier(memberItem);
        if (memberCollectionIdentifiers.includes(memberIdentifier)) {
          return false;
        }
        memberCollectionIdentifiers.push(memberIdentifier);
        return true;
      });
      return [...membersToAdd, ...memberCollection];
    }
    return memberCollection;
  }

  protected convertDateFromClient<T extends IMember | NewMember | PartialUpdateMember>(member: T): RestOf<T> {
    return {
      ...member,
      acceptedDate: member.acceptedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMember: RestMember): IMember {
    return {
      ...restMember,
      acceptedDate: restMember.acceptedDate ? dayjs(restMember.acceptedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMember>): HttpResponse<IMember> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMember[]>): HttpResponse<IMember[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
