import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Event, GetProjectEvents200Response, ProjectEventsService } from 'app/api';
import { IProject } from 'app/entities/project/project.model';

import { ProjectCalendarComponent } from './project-calendar.component';
import { ProjectCalendarModule } from './project-calendar.module';

const project = { id: 1234, token: 'fe156aa6-18e7-40f2-a14f-1ce93eb8d5c8' } as IProject;

describe('Project Calendar', () => {
  let projectEventsService: ProjectEventsService;
  let mockTranslateService: TranslateService;

  let fixture: ComponentFixture<ProjectCalendarComponent>;
  let component: ProjectCalendarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), ProjectCalendarModule],
      providers: [],
    })
      .overrideTemplate(ProjectCalendarComponent, '')
      .compileComponents();

    projectEventsService = TestBed.inject(ProjectEventsService);

    mockTranslateService = TestBed.inject(TranslateService);
    mockTranslateService.currentLang = 'something-I-made-up';

    fixture = TestBed.createComponent(ProjectCalendarComponent);
    component = fixture.componentInstance;
  });

  describe('constructor', () => {
    it('should read the current language', () => {
      // @ts-ignore: force this private property value for testing.
      expect(component.currentLang).toEqual(mockTranslateService.currentLang);
    });

    it('subscribes to language changes', () => {
      const anotherLanguage = 'another-language';
      mockTranslateService.onLangChange.next({ lang: anotherLanguage, translations: {} });

      // @ts-ignore: force this private property value for testing.
      expect(component.currentLang).toEqual(anotherLanguage);
    });
  });

  describe('ngOnInit', () => {
    it('loads all project Events if Project is present', () => {
      const events: Event[] = [
        { id: 1234, startDateTime: '2023-08-28T18:00', endDateTime: '2023-08-28T19:00', location: { id: 2345 } } as Event,
      ];
      jest.spyOn(projectEventsService, 'getProjectEvents').mockReturnValue(
        of(
          new HttpResponse({
            body: { contents: events } as GetProjectEvents200Response,
          }),
        ),
      );

      component.project = project;

      component.ngOnInit();

      expect(projectEventsService.getProjectEvents).toHaveBeenCalledWith(project.id, 0, -1, ['startDateTime,asc'], 'response');
      // @ts-ignore: force this private property value for testing.
      expect(component.events.length).toEqual(1);
    });

    it('loads nothing if no Project is present', () => {
      jest.spyOn(projectEventsService, 'getProjectEvents');

      component.ngOnInit();

      expect(projectEventsService.getProjectEvents).not.toHaveBeenCalled();
    });
  });
});