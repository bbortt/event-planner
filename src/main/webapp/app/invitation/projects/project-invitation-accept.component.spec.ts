import { TranslateModule } from '@ngx-translate/core';

jest.mock('app/core/util/alert.service');

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { Member, Project, ProjectMemberService } from 'app/api';

import { Account } from 'app/core/auth/account.model';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { EntityResponseType, MemberService } from 'app/entities/member/service/member.service';

import ProjectInvitationAcceptComponent from './project-invitation-accept.component';
import ProjectInvitationComponent from './project-invitation.component';

describe('ProjectInvitationAcceptComponent', () => {
  let alertService: AlertService;
  let eventManager: EventManager;
  let memberService: MemberService;
  let projectMemberService: ProjectMemberService;

  let mockRouter: Router;

  let fixture: ComponentFixture<ProjectInvitationAcceptComponent>;
  let component: ProjectInvitationAcceptComponent;

  let project: Project;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), ProjectInvitationAcceptComponent],
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

    project = { id: 1234 } as Project;
    component.project = project;
  });

  const verifySuccessResponse = (): void => {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(alertService.addAlert).toHaveBeenCalledWith({
      type: 'success',
      translationKey: 'app.project.invitation.accepting.success',
      translationParams: { projectName: project.name },
    });
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let email: string;

    beforeEach(() => {
      email = 'maxwell-jordan@localhost';
      component.email = email;

      jest.spyOn(projectMemberService, 'findProjectMemberByTokenAndEmail');
    });

    it('should autocomplete the email from account if non present', () => {
      const account: Account = { email } as Account;
      component.account = account;

      component.email = null;

      component.ngOnInit();

      expect(component.email).toEqual(email);
      expect(projectMemberService.findProjectMemberByTokenAndEmail).toHaveBeenCalledWith(project.id, email, 'response');
    });

    it('should load member data when project and email are provided', () => {
      const member: Member = {} as Member;
      jest.spyOn(projectMemberService, 'findProjectMemberByTokenAndEmail').mockReturnValueOnce(of(new HttpResponse({ body: member })));

      component.ngOnInit();

      expect(component.isLoading).toBe(false);
      expect(component.member).toEqual(member);
      expect(projectMemberService.findProjectMemberByTokenAndEmail).toHaveBeenCalledWith(project.id, email, 'response');
    });

    it('should not load member data if no project present', () => {
      component.project = null;

      component.ngOnInit();

      expect(projectMemberService.findProjectMemberByTokenAndEmail).not.toHaveBeenCalled();
    });

    it('should not load member data if no email present', () => {
      component.email = null;

      component.ngOnInit();

      expect(projectMemberService.findProjectMemberByTokenAndEmail).not.toHaveBeenCalled();
    });

    it('should redirect to home page if membership was already accepted', () => {
      const member: Member = { accepted: true } as Member;
      jest.spyOn(projectMemberService, 'findProjectMemberByTokenAndEmail').mockReturnValueOnce(of(new HttpResponse({ body: member })));

      component.ngOnInit();

      verifySuccessResponse();
      expect(component.isLoading).toBeFalsy();
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
      expect(component.isSaving).toBeFalsy();
    });

    it('should call memberService.create when called with null member', () => {
      const email = 'dal-damoc@localhost';
      component.email = email;

      jest.spyOn(memberService, 'create').mockReturnValueOnce(of({} as EntityResponseType));

      component.acceptInvitation();

      expect(memberService.create).toHaveBeenCalledWith({
        id: null,
        invitedEmail: email,
        accepted: true,
        acceptedBy: 'dal-damoc@localhost',
        acceptedDate: expect.anything(),
        project,
      });

      verifySuccessResponse();
      expect(component.isSaving).toBeFalsy();
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
        expect(component.isSaving).toBeFalsy();
      });

      it('posts error message when memberService.create fails', () => {
        component.acceptInvitation();

        expect(memberService.create).toHaveBeenCalled();

        verifyFailedResponse();
        expect(component.isSaving).toBeFalsy();
      });
    });
  });
});
