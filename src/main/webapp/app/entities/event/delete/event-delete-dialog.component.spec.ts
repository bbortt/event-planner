jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventService } from '../service/event.service';

import EventDeleteDialogComponent from './event-delete-dialog.component';

describe('Event Management Delete Component', () => {
  let service: EventService;
  let mockActiveModal: NgbActiveModal;

  let fixture: ComponentFixture<EventDeleteDialogComponent>;
  let component: EventDeleteDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EventDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(EventDeleteDialogComponent, '')
      .compileComponents();

    service = TestBed.inject(EventService);
    mockActiveModal = TestBed.inject(NgbActiveModal);

    fixture = TestBed.createComponent(EventDeleteDialogComponent);
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
