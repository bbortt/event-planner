import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { InvitationUpdateComponent } from 'app/entities/invitation/invitation-update.component';
import { InvitationService } from 'app/entities/invitation/invitation.service';
import { Invitation } from 'app/shared/model/invitation.model';

describe('Component Tests', () => {
  describe('Invitation Management Update Component', () => {
    let comp: InvitationUpdateComponent;
    let fixture: ComponentFixture<InvitationUpdateComponent>;
    let service: InvitationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [InvitationUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(InvitationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InvitationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(InvitationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Invitation(123);
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
        const entity = new Invitation();
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
