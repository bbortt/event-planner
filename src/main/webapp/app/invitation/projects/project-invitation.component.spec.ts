import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { Project } from 'app/api';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

import { ProjectInvitationComponent } from './project-invitation.component';

const testProject = {} as Project;
const testAccount = {} as Account;

describe('ProjectInvitationComponent', () => {
  let activatedRoute: ActivatedRoute;
  let accountService: AccountService;

  let fixture: ComponentFixture<ProjectInvitationComponent>;
  let component: ProjectInvitationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInvitationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ project: testProject }), queryParams: of({ email: 'test@example.com' }) } },
        { provide: AccountService, useValue: { identity: () => of(testAccount) } },
      ],
    })
      .overrideTemplate(ProjectInvitationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountService = TestBed.inject(AccountService);

    fixture = TestBed.createComponent(ProjectInvitationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load account, project, and invitation email data on ngOnInit', () => {
      const email = 'test@example.com';

      component.ngOnInit();

      expect(component.account).toEqual(testAccount);
      expect(component.project).toEqual(testProject);
      expect(component.invitationEmail).toEqual(email);
    });
  });
});
