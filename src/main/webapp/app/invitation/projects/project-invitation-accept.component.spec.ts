import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { Member, Project, ProjectMemberService } from 'app/api';
import { MemberService } from 'app/entities/member/service/member.service';

import { ProjectInvitationAcceptComponent } from './project-invitation-accept.component';
import { ProjectInvitationComponent } from './project-invitation.component';

describe('ProjectInvitationAcceptComponent', () => {
  let memberService: MemberService;
  let projectMemberService: ProjectMemberService;

  let fixture: ComponentFixture<ProjectInvitationAcceptComponent>;
  let component: ProjectInvitationAcceptComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInvitationAcceptComponent],
      imports: [HttpClientTestingModule],
      providers: [MemberService, ProjectMemberService],
    })
      .overrideTemplate(ProjectInvitationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    memberService = TestBed.inject(MemberService);
    projectMemberService = TestBed.inject(ProjectMemberService);

    fixture = TestBed.createComponent(ProjectInvitationAcceptComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load member data when project and email are provided', () => {
      const project: Project = { id: 1234 } as Project;
      const email = 'maxwell-jordan@localhost';

      const member: Member = {} as Member;
      jest.spyOn(projectMemberService, 'findProjectMemberByTokenAndEmail').mockReturnValueOnce(of(new HttpResponse({ body: member })));

      component.project = project;
      component.email = email;

      component.ngOnInit();

      expect(component.isLoading).toBe(false);
      expect(component.member).toEqual(member);
      expect(projectMemberService.findProjectMemberByTokenAndEmail).toHaveBeenCalledWith(project.id, email, 'response');
    });
  });

  describe('acceptInvitation', () => {
    it('should call memberService.partialUpdate when called with a valid member', () => {
      const member: Member = { id: 1234 } as Member;

      component.member = member;
      jest.spyOn(memberService, 'partialUpdate');

      component.acceptInvitation();

      expect(memberService.partialUpdate).toHaveBeenCalledWith({ id: member.id, accepted: true });
    });

    it('should not call memberService.partialUpdate when called with null member', () => {
      component.member = null;
      jest.spyOn(memberService, 'partialUpdate');

      component.acceptInvitation();

      expect(memberService.partialUpdate).not.toHaveBeenCalled();
    });
  });
});
