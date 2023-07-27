jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { LoginService } from 'app/login/login.service';

import ProjectInvitationLoginComponent from './project-invitation-login.component';

const url = 'test-url';
const testRouter: Router = { url } as Router;

describe('Project Invitation Login Component', () => {
  let loginService: LoginService;
  let stateStorageService: StateStorageService;

  let fixture: ComponentFixture<ProjectInvitationLoginComponent>;
  let component: ProjectInvitationLoginComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProjectInvitationLoginComponent],
      providers: [
        LoginService,
        {
          provide: Router,
          useValue: testRouter,
        },
      ],
    })
      .overrideTemplate(ProjectInvitationLoginComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    loginService = TestBed.inject(LoginService);
    stateStorageService = TestBed.inject(StateStorageService);

    fixture = TestBed.createComponent(ProjectInvitationLoginComponent);
    component = fixture.componentInstance;
  });

  describe('login', () => {
    it('Should call loginService.login on login', () => {
      const storeUrlMock = jest.spyOn(stateStorageService, 'storeUrl');

      component.login();

      expect(storeUrlMock).toHaveBeenCalledWith(url);
      expect(loginService.login).toHaveBeenCalled();
    });
  });
});
