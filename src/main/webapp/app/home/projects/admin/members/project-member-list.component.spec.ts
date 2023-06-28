jest.mock('app/core/util/alert.service');

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of, Subscription } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Project } from 'app/api';
import { AlertService } from 'app/core/util/alert.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MemberService } from 'app/entities/member/service/member.service';

import { ProjectMemberListComponent } from './project-member-list.component';

const project = { token: '9b1ec8a6-7dc6-46d3-ad02-2890ab95eb09' } as Project;

describe('ProjectMemberListComponent', () => {
  let alertService: AlertService;
  let applicationConfigService: ApplicationConfigService;

  let component: ProjectMemberListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ProjectMemberListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ project }),
          },
        },
        AlertService,
        ApplicationConfigService,
        MemberService,
        NgbModal,
      ],
    }).compileComponents();

    alertService = TestBed.inject(AlertService);
    applicationConfigService = TestBed.inject(ApplicationConfigService);

    component = TestBed.createComponent(ProjectMemberListComponent).componentInstance;
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

      // @ts-ignore: force this private property value for testing.
      component.copyInvitationLink();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/invitation/projects/${project.token}`);
      expect(alertService.addAlert).toHaveBeenCalledWith({
        type: 'info',
        translationKey: 'app.project.admin.invitationLinkCopied',
      });
    });
  });

  describe('ngOnInit', () => {
    it('loads project from route', () => {
      component.ngOnInit();

      expect(component.project).toEqual(project);
      // @ts-ignore: force this private property value for testing.
      expect(component.memberUpdatedSource).not.toBeNull();
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
      // @ts-ignore: force this private property value for testing.
      component.memberUpdatedSource = memberUpdatedSource;

      component.ngOnDestroy();

      expect(memberUpdatedSource?.unsubscribe).toHaveBeenCalled();
    });

    test('should not fail if it did not subscribe to router events', () => {
      // @ts-ignore: force this private property value for testing.
      component.memberUpdatedSource = null;

      component.ngOnDestroy();

      expect(memberUpdatedSource?.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
