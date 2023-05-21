import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { from, of, Subject } from 'rxjs';

import { EventManager } from 'app/core/util/event-manager.service';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { LocationFormService } from 'app/entities/location/update/location-form.service';
import { IProject } from 'app/entities/project/project.model';

import { ProjectLocationUpdateComponent } from './project-location-update.component';

describe('Location Management Update Component', () => {
  let comp: ProjectLocationUpdateComponent;
  let fixture: ComponentFixture<ProjectLocationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventManager: EventManager;
  let locationFormService: LocationFormService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectLocationUpdateComponent],
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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Location query and add missing value', () => {
      const location: ILocation = { id: 456 };
      const project: IProject = { id: 35176 };
      location.project = project;
      const parent: ILocation = { id: 83607 };
      location.parent = parent;

      const locationCollection: ILocation[] = [{ id: 19644 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const additionalLocations = [parent];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      comp.existingLocation = location;

      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(expect.objectContaining)
      );
      expect(comp.locationsSharedCollection).toEqual(expectedCollection);

      expect(comp.editForm.get('parent')?.value).toEqual(parent);
      expect(comp.editForm.get('project')?.value).toEqual(project);
    });

    it('Should update editForm', () => {
      const location: ILocation = { id: 456 };
      const project: IProject = { id: 35176 };
      location.project = project;
      const parent: ILocation = { id: 1584 };
      location.parent = parent;

      comp.existingLocation = location;

      comp.ngOnInit();

      expect(comp.locationsSharedCollection).toContain(parent);

      expect(comp.editForm.get('parent')?.value).toEqual(parent);
      expect(comp.editForm.get('project')?.value).toEqual(project);
    });

    it('Should set default values', () => {
      const parent: ILocation = { id: 1584 };
      const project: IProject = { id: 35176 };

      comp.parentLocation = parent;
      comp.project = project;

      comp.ngOnInit();

      expect(comp.editForm.get('parent')?.value).toEqual(parent);
      expect(comp.editForm.get('parent')?.disabled).toBeTruthy();
      expect(comp.editForm.get('project')?.value).toEqual(project);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue(location);
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(expect.objectContaining(location));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: 123 };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue({ id: null });
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(locationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      jest.spyOn(comp, 'previousState');
      jest.spyOn(eventManager, 'broadcast');

      const saveSubject = new Subject<HttpResponse<ILocation>>();
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);

      comp.existingLocation = { id: 123 };

      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationService.update).toHaveBeenCalled();
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
