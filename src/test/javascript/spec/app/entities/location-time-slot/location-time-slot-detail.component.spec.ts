import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { LocationTimeSlotDetailComponent } from 'app/entities/location-time-slot/location-time-slot-detail.component';
import { LocationTimeSlot } from 'app/shared/model/location-time-slot.model';

describe('Component Tests', () => {
  describe('LocationTimeSlot Management Detail Component', () => {
    let comp: LocationTimeSlotDetailComponent;
    let fixture: ComponentFixture<LocationTimeSlotDetailComponent>;
    const route = ({ data: of({ locationTimeSlot: new LocationTimeSlot(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [LocationTimeSlotDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(LocationTimeSlotDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LocationTimeSlotDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load locationTimeSlot on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.locationTimeSlot).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
