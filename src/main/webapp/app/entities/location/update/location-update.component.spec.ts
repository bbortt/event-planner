import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject, from } from 'rxjs';

import { EventManager } from 'app/core/util/event-manager.service';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

import { LocationFormService } from './location-form.service';
import LocationUpdateComponent from './location-update.component';

describe('Location Management Update Component', () => {
  let activatedRoute: ActivatedRoute;
  let eventManager: EventManager;
  let locationFormService: LocationFormService;
  let locationService: LocationService;
  let projectService: ProjectService;

  let fixture: ComponentFixture<LocationUpdateComponent>;
  let component: LocationUpdateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), LocationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LocationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventManager = TestBed.inject(EventManager);
    locationFormService = TestBed.inject(LocationFormService);
    locationService = TestBed.inject(LocationService);
    projectService = TestBed.inject(ProjectService);

    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const location: ILocation = { id: 456 };
      const project: IProject = { id: 61649 };
      location.project = project;

      const projectCollection: IProject[] = [{ id: 73603 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ location });
      component.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(component.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Location query and add missing value', () => {
      const location: ILocation = { id: 456 };
      const parent: ILocation = { id: 83607 };
      location.parent = parent;

      const locationCollection: ILocation[] = [{ id: 19644 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const additionalLocations = [parent];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ location });
      component.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(expect.objectContaining),
      );
      expect(component.locationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const location: ILocation = { id: 456 };
      const project: IProject = { id: 35176 };
      location.project = project;
      const parent: ILocation = { id: 1584 };
      location.parent = parent;

      activatedRoute.data = of({ location });
      component.ngOnInit();

      expect(component.projectsSharedCollection).toContain(project);
      expect(component.locationsSharedCollection).toContain(parent);
      expect(component.location).toEqual(location);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue(location);
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(component, 'previousState');
      activatedRoute.data = of({ location });
      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(component.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(expect.objectContaining(location));
      expect(component.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue({ id: null });
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(component, 'previousState');
      activatedRoute.data = of({ location: null });
      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(locationService.create).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      jest.spyOn(component, 'previousState');
      jest.spyOn(eventManager, 'broadcast');

      const saveSubject = new Subject<HttpResponse<ILocation>>();
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);

      const location = { id: 123 };
      activatedRoute.data = of({ location });

      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationService.update).toHaveBeenCalled();
      expect(eventManager.broadcast).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        component.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLocation', () => {
      it('Should forward to locationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationService, 'compareLocation');
        component.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
