import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { EventPlannerTestModule } from '../../../test.module';
import { MockAccountService } from '../../../helpers/mock-account.service';

import { ProjectService } from 'app/entities/project/project.service';
import { AccountService } from 'app/core/auth/account.service';

import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';
import objectContaining = jasmine.objectContaining;

describe('Component Tests', () => {
  describe('My Projects Component', () => {
    let comp: MyProjectsComponent;
    let fixture: ComponentFixture<MyProjectsComponent>;
    let projectService: ProjectService;
    let accountService: MockAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [MyProjectsComponent],
      })
        .overrideTemplate(MyProjectsComponent, '')
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(MyProjectsComponent);
      comp = fixture.componentInstance;
      projectService = fixture.debugElement.injector.get(ProjectService);
      accountService = (TestBed.inject(AccountService) as unknown) as MockAccountService;
    });

    describe('loadPage', () => {
      beforeEach(() => {
        // GIVEN
        spyOn(projectService, 'query').and.returnValue(of({}));
      });

      it('Should call query projectService for archived on load', () => {
        accountService.hasAnyAuthoritySpy.and.returnValue(true);

        // WHEN
        comp.showArchivedProjects = true;
        comp.showAllProjects = false;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.loadPage();

        // THEN
        expect(projectService.query).toHaveBeenCalledWith(objectContaining({ loadArchived: true, loadAll: false }));
      });

      it('Should call query projectService for all on ADMIN load', inject([], () => {
        accountService.hasAnyAuthoritySpy.and.returnValue({});

        // WHEN
        comp.showArchivedProjects = false;
        comp.showAllProjects = true;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.loadPage();

        // THEN
        expect(projectService.query).toHaveBeenCalledWith(objectContaining({ loadArchived: false, loadAll: true }));
      }));

      it('Should not call query projectService for all', inject([], () => {
        accountService.hasAnyAuthoritySpy.and.returnValue(false);

        // WHEN
        comp.showArchivedProjects = false;
        comp.showAllProjects = true;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.loadPage();

        // THEN
        expect(projectService.query).toHaveBeenCalledWith(objectContaining({ loadArchived: false, loadAll: false }));
      }));
    });
  });
});
