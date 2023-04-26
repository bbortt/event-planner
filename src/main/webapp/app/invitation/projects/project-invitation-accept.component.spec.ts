jest.mock('app/core/util/alert.service');

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { Member, Project, ProjectMemberService } from 'app/api';

import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { EntityResponseType, MemberService } from 'app/entities/member/service/member.service';

import { ProjectInvitationAcceptComponent } from './project-invitation-accept.component';
import { ProjectInvitationComponent } from './project-invitation.component';

describe('ProjectInvitationAcceptComponent', () => {
  let alertService: AlertService;
  let eventManager: EventManager;
  let memberService: MemberService;
  let projectMemberService: ProjectMemberService;

  let mockRouter: Router;

  let fixture: ComponentFixture<ProjectInvitationAcceptComponent>;
  let component: ProjectInvitationAcceptComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInvitationAcceptComponent],
      imports: [HttpClientTestingModule],
      providers: [AlertService, MemberService, ProjectMemberService],
    })
      .overrideTemplate(ProjectInvitationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    alertService = TestBed.inject(AlertService);
    eventManager = TestBed.inject(EventManager);
    memberService = TestBed.inject(MemberService);
    projectMemberService = TestBed.inject(ProjectMemberService);

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture = TestBed.createComponent(ProjectInvitationAcceptComponent);
    component = fixture.componentInstance;
  });

  const verifySuccessResponse = (): void => {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(alertService.addAlert).toHaveBeenCalledWith({
      type: 'success',
      translationKey: 'app.project.invitation.accepting.success',
    });
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load member data when project and email are provided', () => {
      const project: Project = { id: 1234 } as Project;
      component.project = project;

      const email = 'maxwell-jordan@localhost';
      component.email = email;

      const member: Member = {} as Member;
      jest.spyOn(projectMemberService, 'findProjectMemberByTokenAndEmail').mockReturnValueOnce(of(new HttpResponse({ body: member })));

      component.ngOnInit();

      expect(component.isLoading).toBe(false);
      expect(component.member).toEqual(member);
      expect(projectMemberService.findProjectMemberByTokenAndEmail).toHaveBeenCalledWith(project.id, email, 'response');
    });

    it('should redirect to home page if membership was already accepted', () => {
      const project: Project = { id: 1234 } as Project;
      component.project = project;

      const email = 'jackson-day@localhost';
      component.email = email;

      const member: Member = { accepted: true } as Member;
      jest.spyOn(projectMemberService, 'findProjectMemberByTokenAndEmail').mockReturnValueOnce(of(new HttpResponse({ body: member })));

      component.ngOnInit();

      verifySuccessResponse();
    });
  });

  describe('acceptInvitation', () => {
    it('should call memberService.partialUpdate when called with a valid member', () => {
      const member: Member = { id: 1234 } as Member;
      component.member = member;

      jest.spyOn(memberService, 'partialUpdate').mockReturnValueOnce(of({} as EntityResponseType));

      component.acceptInvitation();

      expect(memberService.partialUpdate).toHaveBeenCalledWith({ id: member.id, accepted: true });

      verifySuccessResponse();
    });

    it('should call memberService.create when called with null member', () => {
      const project: Project = { id: 1234 } as Project;
      component.project = project;

      const email = 'dal-damoc@localhost';
      component.email = email;

      jest.spyOn(memberService, 'create').mockReturnValueOnce(of({} as EntityResponseType));

      component.acceptInvitation();

      expect(memberService.create).toHaveBeenCalledWith({ id: null, accepted: true, invitedEmail: email, project });

      verifySuccessResponse();
    });

    describe('subscribes to error responses', () => {
      let httpErrorResponse: HttpErrorResponse;

      const verifyFailedResponse = (): void => {
        expect(eventManager.broadcast).toHaveBeenCalledWith({ name: 'app.httpError', content: httpErrorResponse });
      };

      beforeEach(() => {
        httpErrorResponse = { message: 'test-message' } as HttpErrorResponse;

        jest.spyOn(memberService, 'partialUpdate').mockImplementation(() => throwError(() => httpErrorResponse));
        jest.spyOn(memberService, 'create').mockImplementation(() => throwError(() => httpErrorResponse));
        jest.spyOn(eventManager, 'broadcast');
      });

      it('posts error message when memberService.partialUpdate fails', () => {
        component.member = { id: 1234 } as Member;

        component.acceptInvitation();

        expect(memberService.partialUpdate).toHaveBeenCalled();
        verifyFailedResponse();
      });

      it('posts error message when memberService.create fails', () => {
        component.acceptInvitation();

        expect(memberService.create).toHaveBeenCalled();
        verifyFailedResponse();
      });
    });
  });
});
