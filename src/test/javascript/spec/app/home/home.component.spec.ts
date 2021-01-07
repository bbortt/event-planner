import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlannerTestModule } from '../../test.module';
import { HomeComponent } from 'app/view/home.component';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let accountService: AccountService;
    let loginModalService: LoginModalService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [HomeComponent],
      })
        .overrideTemplate(HomeComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      accountService = TestBed.get(AccountService);
      loginModalService = TestBed.get(LoginModalService);
    });

    it('Should call accountService.isAuthenticated when it checks authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(accountService.isAuthenticated).toHaveBeenCalled();
    });

    it('Should call loginModalService.open on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(loginModalService.open).toHaveBeenCalled();
    });
  });
});
