import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject } from 'rxjs';

import { Location, ProjectLocationService } from 'app/api';

import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { EventFormService } from 'app/entities/event/update/event-form.service';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IProject } from 'app/entities/project/project.model';

import ProjectEventUpdateComponent from './project-event-update.component';

describe('Project Event Update Component', () => {
  let eventFormService: EventFormService;
  let eventService: EventService;
  let locationService: LocationService;
  let projectLocationService: ProjectLocationService;

  let fixture: ComponentFixture<ProjectEventUpdateComponent>;
  let component: ProjectEventUpdateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectEventUpdateComponent],
      providers: [FormBuilder],
    })
      .overrideTemplate(ProjectEventUpdateComponent, '')
      .compileComponents();

    eventFormService = TestBed.inject(EventFormService);
    eventService = TestBed.inject(EventService);
    locationService = TestBed.inject(LocationService);
    projectLocationService = TestBed.inject(ProjectLocationService);

    fixture = TestBed.createComponent(ProjectEventUpdateComponent);
    component = fixture.componentInstance;
  });

  describe('updateForm', () => {
    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const location: ILocation = { id: 66855 };
      event.location = location;

      component.updateForm(event);

      // @ts-ignore: force this private property value for testing.
      expect(component.locationsSharedCollection).toContain(location);
      expect(component.event).toEqual(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);

      const event = { id: 123 };
      component.event = event;
      jest.spyOn(component, 'previousState');

      jest.spyOn(eventFormService, 'getEvent').mockReturnValue(event);

      component.save();

      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(eventService.update).toHaveBeenCalledWith(expect.objectContaining(event));
      expect(component.previousState).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      jest.spyOn(eventService, 'create').mockReturnValue(saveSubject);

      const event = { id: 123 };
      component.event = event;
      jest.spyOn(component, 'previousState');

      jest.spyOn(eventFormService, 'getEvent').mockReturnValue({ id: null });

      component.save();

      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(eventService.create).toHaveBeenCalled();
      expect(component.previousState).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
    });

    it('Should set isSaving to false on error', () => {
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);

      const event = { id: 123 };
      component.event = event;
      jest.spyOn(component, 'previousState');

      jest.spyOn(eventFormService, 'getEvent').mockReturnValue(event);

      component.save();

      expect(component.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      expect(eventService.update).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).not.toHaveBeenCalled();
    });
  });

  describe('loadRelationshipsOptions', () => {
    it('Should load all Events from Project', () => {
      const project: IProject = { id: 35176 };
      const location: ILocation = { id: 42887, project };
      const event: IEvent = { id: 456, location };

      component.event = event;
      component.project = project;

      const locationCollection = [{ id: 91552 }] as Location[];
      jest
        .spyOn(projectLocationService, 'getProjectLocations')
        .mockReturnValue(of(new HttpResponse({ body: { contents: locationCollection } })));
      const additionalLocations = [location];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      component.loadRelationshipsOptions();

      expect(projectLocationService.getProjectLocations).toHaveBeenCalledWith(project.id, 'response');
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(expect.objectContaining),
      );

      // @ts-ignore: force this private property value for testing.
      expect(component.locationsSharedCollection).toEqual(expectedCollection);
    });
  });

  describe('Compare relationships', () => {
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
