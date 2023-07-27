import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject, from } from 'rxjs';

import { EventManager } from 'app/core/util/event-manager.service';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

import { MemberFormService } from './member-form.service';
import MemberUpdateComponent from './member-update.component';

describe('Member Management Update Component', () => {
  let activatedRoute: ActivatedRoute;
  let eventManager: EventManager;
  let memberFormService: MemberFormService;
  let memberService: MemberService;
  let projectService: ProjectService;

  let fixture: ComponentFixture<MemberUpdateComponent>;
  let component: MemberUpdateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MemberUpdateComponent],
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
      .overrideTemplate(MemberUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MemberUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventManager = TestBed.inject(EventManager);
    memberFormService = TestBed.inject(MemberFormService);
    memberService = TestBed.inject(MemberService);
    projectService = TestBed.inject(ProjectService);

    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const member: IMember = { id: 456 };
      const project: IProject = { id: 7538 };
      member.project = project;

      const projectCollection: IProject[] = [{ id: 3153 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ member });
      component.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(component.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const member: IMember = { id: 456 };
      const project: IProject = { id: 30364 };
      member.project = project;

      activatedRoute.data = of({ member });
      component.ngOnInit();

      expect(component.projectsSharedCollection).toContain(project);
      expect(component.member).toEqual(member);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMember>>();
      const member = { id: 123 };
      jest.spyOn(memberFormService, 'getMember').mockReturnValue(member);
      jest.spyOn(memberService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(component, 'previousState');
      activatedRoute.data = of({ member });
      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: member }));
      saveSubject.complete();

      // THEN
      expect(memberFormService.getMember).toHaveBeenCalled();
      expect(component.previousState).toHaveBeenCalled();
      expect(memberService.update).toHaveBeenCalledWith(expect.objectContaining(member));
      expect(component.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMember>>();
      const member = { id: 123 };
      jest.spyOn(memberFormService, 'getMember').mockReturnValue({ id: null });
      jest.spyOn(memberService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(component, 'previousState');
      activatedRoute.data = of({ member: null });
      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: member }));
      saveSubject.complete();

      // THEN
      expect(memberFormService.getMember).toHaveBeenCalled();
      expect(memberService.create).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      jest.spyOn(component, 'previousState');
      jest.spyOn(eventManager, 'broadcast');

      const saveSubject = new Subject<HttpResponse<IMember>>();
      jest.spyOn(memberService, 'update').mockReturnValue(saveSubject);

      const member = { id: 123 };
      activatedRoute.data = of({ member });

      component.ngOnInit();

      // WHEN
      component.save();
      expect(component.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(memberService.update).toHaveBeenCalled();
      expect(eventManager.broadcast).toHaveBeenCalled();
      expect(component.isSaving).toEqual(false);
      expect(component.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        component.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
