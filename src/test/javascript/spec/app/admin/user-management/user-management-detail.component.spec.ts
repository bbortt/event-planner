import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AUTHORITY_USER } from 'app/shared/constants/authority.constants';
import { EventPlannerTestModule } from '../../../test.module';
import { UserManagementDetailComponent } from 'app/admin/user-management/user-management-detail.component';

describe('Component Tests', () => {
  describe('User Management Detail Component', () => {
    let comp: UserManagementDetailComponent;
    let fixture: ComponentFixture<UserManagementDetailComponent>;
    const route: ActivatedRoute = ({
      data: of({
        user: {
          id: 1,
          login: 'user',
          firstName: 'first',
          lastName: 'last',
          email: 'first@last.com',
          activated: true,
          langKey: 'en',
          authorities: [AUTHORITY_USER],
          createdBy: 'admin',
        },
      }),
    } as any) as ActivatedRoute;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [UserManagementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: route,
          },
        ],
      })
        .overrideTemplate(UserManagementDetailComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UserManagementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.user).toEqual(
          jasmine.objectContaining({
            id: 1,
            login: 'user',
            firstName: 'first',
            lastName: 'last',
            email: 'first@last.com',
            activated: true,
            langKey: 'en',
            authorities: [AUTHORITY_USER],
            createdBy: 'admin',
          })
        );
      });
    });
  });
});
