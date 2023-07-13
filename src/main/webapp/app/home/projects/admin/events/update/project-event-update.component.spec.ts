import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject } from 'rxjs';

import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { EventFormService } from 'app/entities/event/update/event-form.service';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { ProjectEventUpdateComponent } from './project-event-update.component';

describe('Project Event Update Component', () => {
  let eventFormService: EventFormService;
  let eventService: EventService;
  let locationService: LocationService;

  let fixture: ComponentFixture<ProjectEventUpdateComponent>;
  let component: ProjectEventUpdateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectEventUpdateComponent],
      providers: [FormBuilder],
    })
      .overrideTemplate(ProjectEventUpdateComponent, '')
      .compileComponents();

    eventFormService = TestBed.inject(EventFormService);
    eventService = TestBed.inject(EventService);
    locationService = TestBed.inject(LocationService);

    fixture = TestBed.createComponent(ProjectEventUpdateComponent);
    component = fixture.componentInstance;
  });

  describe('updateForm', () => {
    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const location: ILocation = { id: 66855 };
      event.location = location;

      component.updateForm(event);

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
    it('Should call Location query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const location: ILocation = { id: 42887 };
      event.location = location;
      component.event = event;

      const locationCollection: ILocation[] = [{ id: 91552 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const additionalLocations = [location];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      component.loadRelationshipsOptions();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(expect.objectContaining),
      );
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
