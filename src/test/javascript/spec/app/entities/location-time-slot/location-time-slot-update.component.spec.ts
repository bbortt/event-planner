import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { LocationTimeSlotUpdateComponent } from 'app/entities/location-time-slot/location-time-slot-update.component';
import { LocationTimeSlotService } from 'app/entities/location-time-slot/location-time-slot.service';
import { LocationTimeSlot } from 'app/shared/model/location-time-slot.model';

describe('Component Tests', () => {
  describe('LocationTimeSlot Management Update Component', () => {
    let comp: LocationTimeSlotUpdateComponent;
    let fixture: ComponentFixture<LocationTimeSlotUpdateComponent>;
    let service: LocationTimeSlotService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [LocationTimeSlotUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(LocationTimeSlotUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationTimeSlotUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LocationTimeSlotService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new LocationTimeSlot(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new LocationTimeSlot();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
