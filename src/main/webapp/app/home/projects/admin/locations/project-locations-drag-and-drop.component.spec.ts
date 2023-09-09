import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, Subject, Subscription } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

import ProjectLocationsDragAndDropComponent from './project-locations-drag-and-drop.component';
import { ILocation } from '../../../../entities/location/location.model';

const project = { id: 1234, token: 'aaa89f38-c222-4530-b983-6c9b70f26609' } as Project;
const projectLocations = [
  {
    id: 4,
    name: 'Location 4',
    children: [
      {
        id: 5,
        name: 'Location 5',
        children: [],
      },
      {
        id: 3,
        name: 'Location 3',
        children: [{ id: 2, name: 'Location 2' }],
      },
    ],
  },
  {
    id: 1,
    children: [],
  },
] as Location[];

describe("Project Locations Drag 'n Drop Component", () => {
  let mockActivatedRoute: ActivatedRoute;
  let mockTranslateService: TranslateService;
  let mockRouter: Router;

  let mockLocationService: LocationService;
  let mockProjectLocationService: ProjectLocationService;

  const locationEventsSubject = new Subject<ILocation>();

  let component: ProjectLocationsDragAndDropComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), ProjectLocationsDragAndDropComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ project }),
            queryParamMap: of(jest.requireActual('@angular/router').convertToParamMap({})),
          },
        },
        LocationService,
        ProjectLocationService,
      ],
    }).compileComponents();

    mockActivatedRoute = TestBed.inject(ActivatedRoute);

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    mockTranslateService = TestBed.inject(TranslateService);

    mockLocationService = TestBed.inject(LocationService);
    // @ts-ignore: force this private property value for testing
    mockLocationService.locationUpdatedSource = locationEventsSubject;

    mockProjectLocationService = TestBed.inject(ProjectLocationService);

    component = TestBed.createComponent(ProjectLocationsDragAndDropComponent).componentInstance;
  });

  describe('ngOnInit', () => {
    it('loads project from route', () => {
      jest
        .spyOn(mockProjectLocationService, 'getProjectLocations')
        .mockReturnValueOnce(of(new HttpResponse({ body: { contents: projectLocations } })));

      component.ngOnInit();

      expect(component.project).toEqual(project);

      expect(mockProjectLocationService.getProjectLocations).toHaveBeenCalledWith(project.id, 'response');

      expect(component.locations).toEqual(projectLocations);
      expect(component.activeLocation).toBeNull();
    });

    it('synchronizes the active location path from router', () => {
      const activeLocationPath = '4,3,2';

      // @ts-ignore: force this read-only property value for testing.
      mockActivatedRoute.queryParamMap = of(
        jest.requireActual('@angular/router').convertToParamMap({
          activeLocationPath,
        }),
      );

      component.locations = projectLocations;

      component.ngOnInit();

      // @ts-ignore: force this private property value for testing
      expect(component.activeLocationPathString).toEqual(activeLocationPath);

      expect(component.activeLocationPath).toEqual([
        {
          id: 4,
          name: 'Location 4',
        },
        {
          id: 3,
          name: 'Location 3',
        },
        {
          id: 2,
          name: 'Location 2',
        },
      ]);
    });

    it('subscribes to the location update events', () => {
      component.ngOnInit();

      // @ts-ignore: force this private property value for testing
      expect(component.locationUpdatedSource).not.toBeNull();
    });

    it('translated the "addChild" button tooltip', () => {
      jest.spyOn(mockTranslateService, 'get').mockImplementation((key: string | string[]) => of(`${key as string} translated`));

      component.ngOnInit();

      expect(component.createNewLocationWithParentText).toEqual('app.project.admin.location.addChild translated');
    });
  });

  describe('ngOnDestroy', () => {
    let locationUpdatedSource: Subscription | null = null;

    beforeEach(() => {
      locationUpdatedSource = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;
    });

    test('should unsubscribe from router events', () => {
      // @ts-ignore: force this private property value for testing
      component.locationUpdatedSource = locationUpdatedSource;

      component.ngOnDestroy();

      expect(locationUpdatedSource?.unsubscribe).toHaveBeenCalled();
    });

    test('should not fail if it did not subscribe to router events', () => {
      // @ts-ignore: force this private property value for testing
      component.locationUpdatedSource = null;

      component.ngOnDestroy();

      expect(locationUpdatedSource?.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('handleLocationControl', () => {
    describe('with "select"', () => {
      it('synchronizes the router state with location', () => {
        const location = { id: 2 } as Location;
        component.locations = [{ id: 1, children: [location] }, { id: 3 }] as Location[];

        component.handleLocationControl({ type: 'select', location });

        expect(component.activeLocation).toEqual(location);
        expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { activeLocationPath: '1,2' } });
      });

      it('selects location root with null', () => {
        component.locations = [{ id: 1, children: [{ id: 2 }] }, { id: 3 }] as Location[];

        component.handleLocationControl({ type: 'select' });

        expect(component.activeLocation).toBeNull();
        expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { activeLocationPath: '' } });
      });
    });

    describe('with "delete"', () => {
      it('reloads the locations', () => {
        jest.spyOn(mockProjectLocationService, 'getProjectLocations').mockReturnValueOnce(of(new HttpResponse({ body: {} })));

        component.project = project;

        component.handleLocationControl({ type: 'delete' });

        expect(component.activeLocation).toBeNull();
        expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { activeLocationPath: '' } });
        expect(mockProjectLocationService.getProjectLocations).toHaveBeenCalledWith(project.id, 'response');
        expect(component.isLoading).toBeFalsy();
      });
    });
  });
});
