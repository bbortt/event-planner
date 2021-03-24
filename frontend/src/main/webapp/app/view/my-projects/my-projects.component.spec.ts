jest.mock('@angular/router');
jest.mock('app/core/auth/account.service');

import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { ProjectService } from 'app/entities/project/project.service';

import { Project } from 'app/entities/project/project.model';

import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';

import objectContaining = jasmine.objectContaining;

describe('Component Tests', () => {
  describe('My Projects Component', () => {
    let comp: MyProjectsComponent;
    let fixture: ComponentFixture<MyProjectsComponent>;
    let mockAccountService: AccountService;
    let projectService: ProjectService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, TranslateModule.forRoot()],
          declarations: [MyProjectsComponent],
          providers: [Router, ActivatedRoute, AccountService, ProjectService],
        })
          .overrideTemplate(MyProjectsComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(MyProjectsComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      projectService = TestBed.inject(ProjectService);
    });

    describe('loadPage', () => {
      beforeEach(() => {
        // GIVEN
        projectService.query = jest.fn(() => of({} as HttpResponse<Project[]>));
      });

      it('Should call query projectService for archived on load', () => {
        mockAccountService.hasAnyAuthority = jest.fn(() => true);

        // WHEN
        comp.showArchivedProjects = true;
        comp.showAllProjects = false;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.loadPage();

        // THEN
        expect(projectService.query).toHaveBeenCalledWith(
          objectContaining({
            loadArchived: true,
            loadAll: false,
          })
        );
      });

      it('Should call query projectService for all on ADMIN load', () => {
        mockAccountService.hasAnyAuthority = jest.fn(() => true);

        // WHEN
        comp.showArchivedProjects = false;
        comp.showAllProjects = true;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.loadPage();

        // THEN
        expect(projectService.query).toHaveBeenCalledWith(
          objectContaining({
            loadArchived: false,
            loadAll: true,
          })
        );
      });

      it('Should not call query projectService for all', () => {
        mockAccountService.hasAnyAuthority = jest.fn(() => false);

        // WHEN
        comp.showArchivedProjects = false;
        comp.showAllProjects = true;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.loadPage();

        // THEN
        expect(projectService.query).toHaveBeenCalledWith(
          objectContaining({
            loadArchived: false,
            loadAll: false,
          })
        );
      });
    });
  });
});
