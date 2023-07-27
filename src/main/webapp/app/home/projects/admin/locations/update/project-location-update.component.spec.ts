import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { from, of, Subject } from 'rxjs';

import { GetProjectLocations200Response, Location as ApiLocation, ProjectLocationService } from 'app/api';
import { EventManager } from 'app/core/util/event-manager.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { LocationFormService } from 'app/entities/location/update/location-form.service';
import { IProject } from 'app/entities/project/project.model';

import ProjectLocationUpdateComponent from './project-location-update.component';

describe('Project Location Update Component', () => {
  let activatedRoute: ActivatedRoute;
  let eventManager: EventManager;
  let locationFormService: LocationFormService;
  let locationService: LocationService;
  let projectLocationService: ProjectLocationService;

  let fixture: ComponentFixture<ProjectLocationUpdateComponent>;
  let comp: ProjectLocationUpdateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectLocationUpdateComponent],
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
      .overrideTemplate(ProjectLocationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectLocationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventManager = TestBed.inject(EventManager);
    locationFormService = TestBed.inject(LocationFormService);
    locationService = TestBed.inject(LocationService);
    projectLocationService = TestBed.inject(ProjectLocationService);

    comp = fixture.componentInstance;
  });

  describe('lateInit', () => {
    const verifyDefaultFormSettings = (): void => {
      expect(comp.editForm.controls.createdBy.disabled).toBeTruthy();
      expect(comp.editForm.controls.createdDate.disabled).toBeTruthy();
      expect(comp.editForm.controls.lastModifiedBy.disabled).toBeTruthy();
      expect(comp.editForm.controls.lastModifiedDate.disabled).toBeTruthy();
    };

    it('Should not load anything if no Project present', () => {
      jest.spyOn(projectLocationService, 'getProjectLocations');
      jest.spyOn(projectLocationService, 'getProjectLocationsWithoutSelf');

      const location: ILocation = { id: 456 };
      comp.existingLocation = location;

      comp.lateInit();

      expect(projectLocationService.getProjectLocations).not.toHaveBeenCalled();
      expect(projectLocationService.getProjectLocationsWithoutSelf).not.toHaveBeenCalled();

      verifyDefaultFormSettings();
    });

    it('Does not invoke backend calls twice', () => {
      jest.spyOn(projectLocationService, 'getProjectLocations');
      jest.spyOn(projectLocationService, 'getProjectLocationsWithoutSelf');

      const location: ILocation = { id: 456 };
      comp.locationsSharedCollection = [location];

      comp.lateInit();

      expect(projectLocationService.getProjectLocations).not.toHaveBeenCalled();
      expect(projectLocationService.getProjectLocationsWithoutSelf).not.toHaveBeenCalled();
    });

    it('Should load all Locations from Project', () => {
      const id = 19644;
      const name = 'test-name';

      const project: IProject = { id: 35176 };

      const locationCollection: ApiLocation[] = [{ id, name, children: [] }];
      jest
        .spyOn(projectLocationService, 'getProjectLocations')
        .mockReturnValue(of(new HttpResponse<GetProjectLocations200Response>({ body: { contents: locationCollection } })));
      const expectedCollection: ILocation[] = [{ id, name }];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      comp.project = project;

      comp.lateInit();

      expect(projectLocationService.getProjectLocations).toHaveBeenCalledWith(project.id, 'response');
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(expectedCollection, undefined);
      expect(comp.locationsSharedCollection).toEqual(expectedCollection);

      expect(comp.editForm.controls.parent.value).toBeNull();
      expect(comp.editForm.controls.project.value).toEqual(project);
    });

    it('Should load all Locations from Project except the existing Location', () => {
      const id = 19655;
      const name = 'test-location';

      const location: ILocation = { id: 456 };
      const project: IProject = { id: 35176 };
      location.project = project;
      const parent: ILocation = { id: 83607 };
      location.parent = parent;

      const locationCollection: ApiLocation[] = [{ id, name, children: [] }];
      jest
        .spyOn(projectLocationService, 'getProjectLocationsWithoutSelf')
        .mockReturnValue(of(new HttpResponse<GetProjectLocations200Response>({ body: { contents: locationCollection } })));
      const additionalLocations = [parent];
      const expectedCollection: ILocation[] = [...additionalLocations, { id, name }];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      comp.existingLocation = location;
      comp.project = project;

      comp.lateInit();

      expect(projectLocationService.getProjectLocationsWithoutSelf).toHaveBeenCalledWith(project.id, location.id, 'response');
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledTimes(2);
      expect(comp.locationsSharedCollection).toEqual(expectedCollection);

      expect(comp.editForm.get('parent')?.value).toEqual(parent);
      expect(comp.editForm.get('project')?.value).toEqual(project);
    });

    it('Should set default values', () => {
      const parent: ILocation = { id: 1584 };
      const project: IProject = { id: 35176 };

      comp.parentLocation = parent;
      comp.project = project;

      jest
        .spyOn(projectLocationService, 'getProjectLocations')
        .mockReturnValue(of(new HttpResponse<GetProjectLocations200Response>({ body: { contents: [] } })));

      comp.lateInit();

      expect(comp.editForm.get('parent')?.value).toEqual(parent);
      expect(comp.editForm.get('parent')?.disabled).toBeTruthy();
      expect(comp.editForm.get('project')?.value).toEqual(project);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue(location);
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.lateInit();

      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(expect.objectContaining(location));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue({ id: null });
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location: null });
      comp.lateInit();

      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(locationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      jest.spyOn(comp, 'previousState');
      jest.spyOn(eventManager, 'broadcast');

      const saveSubject = new Subject<HttpResponse<ILocation>>();
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);

      comp.existingLocation = { id: 123 };

      comp.lateInit();

      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      expect(locationService.create).toHaveBeenCalled();
      expect(eventManager.broadcast).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocation', () => {
      it('Should forward to locationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
