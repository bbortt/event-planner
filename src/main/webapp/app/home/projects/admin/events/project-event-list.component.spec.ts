import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { Event, GetProjectEvents200Response, Project, ProjectEventsService } from 'app/api';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EventService } from 'app/entities/event/service/event.service';

import ProjectEventListComponent from './project-event-list.component';

import SpyInstance = jest.SpyInstance;

const project = { id: 1234, token: '50930adc-8534-4eac-9667-63beba03b658' } as Project;

describe('Project Event List', () => {
  let comp: ProjectEventListComponent;
  let fixture: ComponentFixture<ProjectEventListComponent>;
  let eventService: EventService;
  let projectEventsService: ProjectEventsService;
  let routerNavigateSpy: SpyInstance<Promise<boolean>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'event', component: ProjectEventListComponent }]),
        HttpClientTestingModule,
        ProjectEventListComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ProjectEventListComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectEventListComponent);
    comp = fixture.componentInstance;

    eventService = TestBed.inject(EventService);
    projectEventsService = TestBed.inject(ProjectEventsService);
    // @ts-ignore: force this private property value for testing.
    routerNavigateSpy = jest.spyOn(comp.router, 'navigate');

    const headers = new HttpHeaders();
    jest.spyOn(projectEventsService, 'getProjectEvents').mockReturnValue(
      of(
        new HttpResponse({
          body: { contents: [{ id: 123 }] as Event[] } as GetProjectEvents200Response,
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    comp.project = project;

    // WHEN
    comp.ngOnInit();

    // THEN
    expect(projectEventsService.getProjectEvents).toHaveBeenCalledWith(project.id, ITEMS_PER_PAGE, 1, ['id,desc'], 'response');
    expect(comp.events?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to eventService', () => {
      const entity = { id: 123 } as Event;
      jest.spyOn(eventService, 'getEventIdentifier');
      const id = comp.trackId(0, entity);
      expect(eventService.getEventIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });

  it('should load a page', () => {
    // WHEN
    comp.navigateToPage(1);

    // THEN
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // GIVEN
    comp.predicate = 'name';

    // WHEN
    comp.navigateToWithComponentValues();

    // THEN
    expect(routerNavigateSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        queryParams: expect.objectContaining({
          sort: ['name,asc'],
        }),
      })
    );
  });
});
