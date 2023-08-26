jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from '../service/project.service';

import ProjectDeleteDialogComponent from './project-delete-dialog.component';

describe('Project Management Delete Component', () => {
  let service: ProjectService;
  let mockActiveModal: NgbActiveModal;

  let fixture: ComponentFixture<ProjectDeleteDialogComponent>;
  let component: ProjectDeleteDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ProjectDeleteDialogComponent, '')
      .compileComponents();

    service = TestBed.inject(ProjectService);
    mockActiveModal = TestBed.inject(NgbActiveModal);

    fixture = TestBed.createComponent(ProjectDeleteDialogComponent);
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
      }),
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
