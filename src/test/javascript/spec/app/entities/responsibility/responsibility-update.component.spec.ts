import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { ResponsibilityUpdateComponent } from 'app/entities/responsibility/responsibility-update.component';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { Responsibility } from 'app/shared/model/responsibility.model';

describe('Component Tests', () => {
  describe('Responsibility Management Update Component', () => {
    let comp: ResponsibilityUpdateComponent;
    let fixture: ComponentFixture<ResponsibilityUpdateComponent>;
    let service: ResponsibilityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [ResponsibilityUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ResponsibilityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResponsibilityUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResponsibilityService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Responsibility(123);
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
        const entity = new Responsibility();
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
