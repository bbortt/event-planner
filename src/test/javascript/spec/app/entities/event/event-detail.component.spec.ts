import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { EventDetailComponent } from 'app/entities/event/event-detail.component';
import { Event } from 'app/shared/model/event.model';

describe('Component Tests', () => {
  describe('Event Management Detail Component', () => {
    let comp: EventDetailComponent;
    let fixture: ComponentFixture<EventDetailComponent>;
    const route = ({ data: of({ event: new Event(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [EventDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(EventDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load event on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.event).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
