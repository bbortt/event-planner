import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';

import { IProject, NewProject } from '../project.model';

export type PartialUpdateProject = Partial<IProject> & Pick<IProject, 'id'>;

type RestOf<T extends IProject | NewProject> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProject = RestOf<IProject>;

export type NewRestProject = RestOf<NewProject>;

export type PartialUpdateRestProject = RestOf<PartialUpdateProject>;

export type EntityResponseType = HttpResponse<IProject>;
export type EntityArrayResponseType = HttpResponse<IProject[]>;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly resourceUrl;

  private projectUpdatedSource = new Subject<IProject>();
  private _projectUpdatedSource$ = this.projectUpdatedSource.asObservable();

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/projects');
  }

  get projectUpdatedSource$(): Observable<IProject> {
    return this._projectUpdatedSource$;
  }

  create(project: NewProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http.post<RestProject>(this.resourceUrl, copy, { observe: 'response' }).pipe(
      map(res => this.convertResponseFromServer(res)),
      tap(res => this.notifySubscribersOfChangedProject(res))
    );
  }

  update(project: IProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http.put<RestProject>(`${this.resourceUrl}/${this.getProjectIdentifier(project)}`, copy, { observe: 'response' }).pipe(
      map(res => this.convertResponseFromServer(res)),
      tap(res => this.notifySubscribersOfChangedProject(res))
    );
  }

  partialUpdate(project: PartialUpdateProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http.patch<RestProject>(`${this.resourceUrl}/${this.getProjectIdentifier(project)}`, copy, { observe: 'response' }).pipe(
      map(res => this.convertResponseFromServer(res)),
      tap(res => this.notifySubscribersOfChangedProject(res))
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProject>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProject[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectIdentifier(project: Pick<IProject, 'id'>): number {
    return project.id;
  }

  compareProject(o1: Pick<IProject, 'id'> | null, o2: Pick<IProject, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectIdentifier(o1) === this.getProjectIdentifier(o2) : o1 === o2;
  }

  addProjectToCollectionIfMissing<Type extends Pick<IProject, 'id'>>(
    projectCollection: Type[],
    ...projectsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projects: Type[] = projectsToCheck.filter(isPresent);
    if (projects.length > 0) {
      const projectCollectionIdentifiers = projectCollection.map(projectItem => this.getProjectIdentifier(projectItem)!);
      const projectsToAdd = projects.filter(projectItem => {
        const projectIdentifier = this.getProjectIdentifier(projectItem);
        if (projectCollectionIdentifiers.includes(projectIdentifier)) {
          return false;
        }
        projectCollectionIdentifiers.push(projectIdentifier);
        return true;
      });
      return [...projectsToAdd, ...projectCollection];
    }
    return projectCollection;
  }

  protected convertDateFromClient<T extends IProject | NewProject | PartialUpdateProject>(project: T): RestOf<T> {
    return {
      ...project,
      startDate: project.startDate?.toJSON() ?? null,
      endDate: project.endDate?.toJSON() ?? null,
      createdDate: project.createdDate?.toJSON() ?? null,
      lastModifiedDate: project.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProject: RestProject): IProject {
    return {
      ...restProject,
      startDate: restProject.startDate ? dayjs(restProject.startDate) : undefined,
      endDate: restProject.endDate ? dayjs(restProject.endDate) : undefined,
      createdDate: restProject.createdDate ? dayjs(restProject.createdDate) : undefined,
      lastModifiedDate: restProject.lastModifiedDate ? dayjs(restProject.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProject>): HttpResponse<IProject> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProject[]>): HttpResponse<IProject[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  private notifySubscribersOfChangedProject(res: HttpResponse<IProject>): void {
    if (res.body) {
      this.projectUpdatedSource.next(res.body);
    }
  }
}
