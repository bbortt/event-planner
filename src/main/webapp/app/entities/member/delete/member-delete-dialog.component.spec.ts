jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MemberService } from '../service/member.service';

import MemberDeleteDialogComponent from './member-delete-dialog.component';

describe('Member Management Delete Component', () => {
  let service: MemberService;
  let mockActiveModal: NgbActiveModal;

  let fixture: ComponentFixture<MemberDeleteDialogComponent>;
  let component: MemberDeleteDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MemberDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(MemberDeleteDialogComponent, '')
      .compileComponents();

    service = TestBed.inject(MemberService);
    mockActiveModal = TestBed.inject(NgbActiveModal);

    fixture = TestBed.createComponent(MemberDeleteDialogComponent);
    component = fixture.componentInstance;
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        component.confirmDelete(123);
        tick();

        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      jest.spyOn(service, 'delete');

      component.cancel();

      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
