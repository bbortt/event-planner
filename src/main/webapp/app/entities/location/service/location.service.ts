import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';

import { ILocation, NewLocation } from '../location.model';

export type PartialUpdateLocation = Partial<ILocation> & Pick<ILocation, 'id'>;

type RestOf<T extends ILocation | NewLocation> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestLocation = RestOf<ILocation>;

export type NewRestLocation = RestOf<NewLocation>;

export type PartialUpdateRestLocation = RestOf<PartialUpdateLocation>;

export type EntityResponseType = HttpResponse<ILocation>;
export type EntityArrayResponseType = HttpResponse<ILocation[]>;

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly resourceUrl;

  private locationUpdatedSource = new Subject<ILocation>();
  private _locationUpdatedSource$ = this.locationUpdatedSource.asObservable();

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/locations');
  }

  get locationUpdatedSource$(): Observable<ILocation> {
    return this._locationUpdatedSource$;
  }

  public notifyLocationUpdates(location: ILocation): void {
    this.notifySubscribersOfChangedMember({ body: location } as HttpResponse<ILocation>);
  }

  create(location: NewLocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(location);
    return this.http.post<RestLocation>(this.resourceUrl, copy, { observe: 'response' }).pipe(
      map(res => this.convertResponseFromServer(res)),
      tap(res => this.notifySubscribersOfChangedMember(res)),
    );
  }

  update(location: ILocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(location);
    return this.http.put<RestLocation>(`${this.resourceUrl}/${this.getLocationIdentifier(location)}`, copy, { observe: 'response' }).pipe(
      map(res => this.convertResponseFromServer(res)),
      tap(res => this.notifySubscribersOfChangedMember(res)),
    );
  }

  partialUpdate(location: PartialUpdateLocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(location);
    return this.http.patch<RestLocation>(`${this.resourceUrl}/${this.getLocationIdentifier(location)}`, copy, { observe: 'response' }).pipe(
      map(res => this.convertResponseFromServer(res)),
      tap(res => this.notifySubscribersOfChangedMember(res)),
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLocation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLocation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLocationIdentifier(location: Pick<ILocation, 'id'>): number {
    return location.id;
  }

  compareLocation(o1: Pick<ILocation, 'id'> | null, o2: Pick<ILocation, 'id'> | null): boolean {
    return o1 && o2 ? this.getLocationIdentifier(o1) === this.getLocationIdentifier(o2) : o1 === o2;
  }

  addLocationToCollectionIfMissing<Type extends Pick<ILocation, 'id'>>(
    locationCollection: Type[],
    ...locationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const locations: Type[] = locationsToCheck.filter(isPresent);
    if (locations.length > 0) {
      const locationCollectionIdentifiers = locationCollection.map(locationItem => this.getLocationIdentifier(locationItem)!);
      const locationsToAdd = locations.filter(locationItem => {
        const locationIdentifier = this.getLocationIdentifier(locationItem);
        if (locationCollectionIdentifiers.includes(locationIdentifier)) {
          return false;
        }
        locationCollectionIdentifiers.push(locationIdentifier);
        return true;
      });
      return [...locationsToAdd, ...locationCollection];
    }
    return locationCollection;
  }

  protected convertDateFromClient<T extends ILocation | NewLocation | PartialUpdateLocation>(location: T): RestOf<T> {
    return {
      ...location,
      createdDate: location.createdDate?.toJSON() ?? null,
      lastModifiedDate: location.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLocation: RestLocation): ILocation {
    return {
      ...restLocation,
      createdDate: restLocation.createdDate ? dayjs(restLocation.createdDate) : undefined,
      lastModifiedDate: restLocation.lastModifiedDate ? dayjs(restLocation.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLocation>): HttpResponse<ILocation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLocation[]>): HttpResponse<ILocation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  private notifySubscribersOfChangedMember(res: HttpResponse<ILocation>): void {
    if (res.body) {
      this.locationUpdatedSource.next(res.body);
    }
  }
}
