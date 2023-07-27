import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject, from } from 'rxjs';

import { EventManager } from 'app/core/util/event-manager.service';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

import { ProjectFormService } from './project-form.service';
import ProjectUpdateComponent from './project-update.component';

describe('Project Management Update Component', () => {
  let activatedRoute: ActivatedRoute;
  let eventManager: EventManager;
  let projectFormService: ProjectFormService;
  let projectService: ProjectService;

  let fixture: ComponentFixture<ProjectUpdateComponent>;
  let component: ProjectUpdateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProjectUpdateComponent, '')
      .compileComponents();

    activatedRoute = TestBed.inject(ActivatedRoute);
    eventManager = TestBed.inject(EventManager);
    projectFormService = TestBed.inject(ProjectFormService);
    projectService = TestBed.inject(ProjectService);

    fixture = TestBed.createComponent(ProjectUpdateComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const project: IProject = { id: 456 };

      activatedRoute.data = of({ project });
      component.ngOnInit();

      expect(component.project).toEqual(project);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProject>>();
      const project = { id: 123 };
      jest.spyOn(projectFormService, 'getProject').mockReturnValue(project);
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(component, 'previousState');
      activatedRoute.data = of({ project });
      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(projectFormService.getProject).toHaveBeenCalled();
      expect(component.previousState).toHaveBeenCalled();
      expect(projectService.update).toHaveBeenCalledWith(expect.objectContaining(project));
      expect(component.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProject>>();
      const project = { id: 123 };
      jest.spyOn(projectFormService, 'getProject').mockReturnValue({ id: null });
      jest.spyOn(projectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(component, 'previousState');
      activatedRoute.data = of({ project: null });
      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(projectFormService.getProject).toHaveBeenCalled();
      expect(projectService.create).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      jest.spyOn(component, 'previousState');
      jest.spyOn(eventManager, 'broadcast');

      const saveSubject = new Subject<HttpResponse<IProject>>();
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);

      const project = { id: 123 };
      activatedRoute.data = of({ project });

      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectService.update).toHaveBeenCalled();
      expect(eventManager.broadcast).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).not.toHaveBeenCalled();
    });
  });
});
