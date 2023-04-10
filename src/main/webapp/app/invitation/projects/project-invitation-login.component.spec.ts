jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginService } from 'app/login/login.service';

import { ProjectInvitationLoginComponent } from './project-invitation-login.component';

describe('Project Invitation Login Component', () => {
  let comp: ProjectInvitationLoginComponent;
  let fixture: ComponentFixture<ProjectInvitationLoginComponent>;
  let mockLoginService: LoginService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInvitationLoginComponent],
      providers: [LoginService],
    })
      .overrideTemplate(ProjectInvitationLoginComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInvitationLoginComponent);
    comp = fixture.componentInstance;
    mockLoginService = TestBed.inject(LoginService);
  });

  describe('login', () => {
    it('Should call loginService.login on login', () => {
      comp.login();

      expect(mockLoginService.login).toHaveBeenCalled();
    });
  });
});
