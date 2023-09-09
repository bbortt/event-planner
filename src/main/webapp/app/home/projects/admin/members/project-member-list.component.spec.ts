import { RouterTestingModule } from '@angular/router/testing';

jest.mock('app/core/util/alert.service');

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of, Subscription } from 'rxjs';

import { Member, Project, ProjectMemberService } from 'app/api';
import { AlertService } from 'app/core/util/alert.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MemberService } from 'app/entities/member/service/member.service';

import ProjectMemberListComponent from './project-member-list.component';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

const project = { id: 2345, token: '9b1ec8a6-7dc6-46d3-ad02-2890ab95eb09' } as Project;

describe('ProjectMemberListComponent', () => {
  let alertService: AlertService;
  let applicationConfigService: ApplicationConfigService;

  let memberService: MemberService;
  let projectMemberService: ProjectMemberService;

  let component: ProjectMemberListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'project-member-list', component: ProjectMemberListComponent }]),
        HttpClientTestingModule,
        ProjectMemberListComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ defaultSort: 'acceptedDate,desc', project }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
          },
        },
        AlertService,
      ],
    })
      .overrideTemplate(ProjectMemberListComponent, '')
      .compileComponents();

    alertService = TestBed.inject(AlertService);
    applicationConfigService = TestBed.inject(ApplicationConfigService);

    memberService = TestBed.inject(MemberService);
    projectMemberService = TestBed.inject(ProjectMemberService);

    component = TestBed.createComponent(ProjectMemberListComponent).componentInstance;
  });

  beforeEach(() => {
    const headers = new HttpHeaders();
    jest.spyOn(projectMemberService, 'getProjectMembers').mockReturnValue(
      of(
        new HttpResponse({
          body: { contents: [{ id: 1234 } as Member] },
          headers,
        }),
      ),
    );
  });

  describe('ngOnInit', () => {
    it('loads project and members from route', () => {
      component.ngOnInit();

      expect(component.project).toEqual(project);
      // @ts-ignore: force this private property value for testing
      expect(component.memberUpdatedSource).not.toBeNull();

      expect(projectMemberService.getProjectMembers).toHaveBeenCalledWith(project.id, 20, 1, ['id,desc'], 'response');
      expect(component.members?.[0]).toEqual(expect.objectContaining({ id: 1234 }));
    });

    it('respects default sort when non provided through route', () => {
      // @ts-ignore: force this read-only property value for testing.
      TestBed.inject(ActivatedRoute).queryParamMap = of(
        jest.requireActual('@angular/router').convertToParamMap({
          page: '1',
          size: '1',
        }),
      );

      component.ngOnInit();

      expect(component.project).toEqual(project);
      // @ts-ignore: force this private property value for testing
      expect(component.memberUpdatedSource).not.toBeNull();

      expect(projectMemberService.getProjectMembers).toHaveBeenCalledWith(project.id, 20, 1, ['acceptedDate,desc'], 'response');
      expect(component.members?.[0]).toEqual(expect.objectContaining({ id: 1234 }));
    });
  });

  describe('ngOnDestroy', () => {
    let memberUpdatedSource: Subscription | null = null;

    beforeEach(() => {
      memberUpdatedSource = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;
    });

    test('should unsubscribe from router events', () => {
      // @ts-ignore: force this private property value for testing
      component.memberUpdatedSource = memberUpdatedSource;

      component.ngOnDestroy();

      expect(memberUpdatedSource?.unsubscribe).toHaveBeenCalled();
    });

    test('should not fail if it did not subscribe to router events', () => {
      // @ts-ignore: force this private property value for testing
      component.memberUpdatedSource = null;

      component.ngOnDestroy();

      expect(memberUpdatedSource?.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('trackId', () => {
    it('Should forward to bankAccountService', () => {
      const member = { id: 123 } as Member;
      jest.spyOn(memberService, 'getMemberIdentifier');
      const id = component.trackId(0, member);
      expect(memberService.getMemberIdentifier).toHaveBeenCalledWith(member);
      expect(id).toBe(member.id);
    });
  });

  describe('copyInvitationLink', () => {
    Object.assign(navigator, {
      clipboard: {
        // @ts-ignore: force this unused method for testing.
        // eslint-disable-next-line @typescript-eslint/no-empty-function, object-shorthand
        writeText: () => {},
      },
    });

    it('should call navigator.clipboard.writeText with the invitation link', () => {
      component.project = project;

      jest.spyOn(navigator.clipboard, 'writeText').mockReturnValueOnce(Promise.resolve());
      jest.spyOn(applicationConfigService, 'getEndpointFor').mockReturnValueOnce(`invitation/projects/${project.token}`);

      // @ts-ignore: force this private property value for testing
      component.copyInvitationLink();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/invitation/projects/${project.token}`);
      expect(alertService.addAlert).toHaveBeenCalledWith({
        type: 'info',
        translationKey: 'app.project.admin.invitationLinkCopied',
      });
    });
  });
});
