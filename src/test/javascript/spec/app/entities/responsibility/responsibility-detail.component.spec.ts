import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { ResponsibilityDetailComponent } from 'app/entities/responsibility/responsibility-detail.component';
import { Responsibility } from 'app/shared/model/responsibility.model';

describe('Component Tests', () => {
  describe('Responsibility Management Detail Component', () => {
    let comp: ResponsibilityDetailComponent;
    let fixture: ComponentFixture<ResponsibilityDetailComponent>;
    const route = ({ data: of({ responsibility: new Responsibility(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [ResponsibilityDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ResponsibilityDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResponsibilityDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load responsibility on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.responsibility).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
