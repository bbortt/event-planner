import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, Subscription } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

import { ProjectLocationsDragAndDropComponent } from './project-locations-drag-and-drop.component';

const activeLocationPath = '4,3,2';
const project = { token: 'aaa89f38-c222-4530-b983-6c9b70f26609' } as Project;

describe("Project Locations Drag 'n Drop Component", () => {
  let mockRouter: Router;
  let mockTranslateService: TranslateService;

  let component: ProjectLocationsDragAndDropComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ProjectLocationsDragAndDropComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ project }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                activeLocationPath,
              })
            ),
          },
        },
        LocationService,
        ProjectLocationService,
      ],
    }).compileComponents();

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    mockTranslateService = TestBed.inject(TranslateService);
    jest.spyOn(mockTranslateService, 'get').mockImplementation((key: string | string[]) => of(`${key as string} translated`));

    component = TestBed.createComponent(ProjectLocationsDragAndDropComponent).componentInstance;
  });

  describe('ngOnInit', () => {
    it('loads project from route', () => {
      const location = { id: 2, name: 'Location 2' } as Location;
      component.locations = [
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
              children: [location],
            },
          ],
        },
        {
          id: 1,
          children: [],
        },
      ] as Location[];

      component.ngOnInit();

      expect(component.project).toEqual(project);

      expect(component.activeLocation).toEqual(location);
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

      // @ts-ignore: force this private property value for testing.
      expect(component.activeLocationPathString).toEqual(activeLocationPath);
      // @ts-ignore: force this private property value for testing.
      expect(component.locationUpdatedSource).not.toBeNull();

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
      // @ts-ignore: force this private property value for testing.
      component.locationUpdatedSource = locationUpdatedSource;

      component.ngOnDestroy();

      expect(locationUpdatedSource?.unsubscribe).toHaveBeenCalled();
    });

    test('should not fail if it did not subscribe to router events', () => {
      // @ts-ignore: force this private property value for testing.
      component.locationUpdatedSource = null;

      component.ngOnDestroy();

      expect(locationUpdatedSource?.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('setActiveLocation', () => {
    it('synchronizes the router state', () => {
      const location = { id: 2 } as Location;
      component.locations = [{ id: 1, children: [location] }, { id: 3 }] as Location[];

      component.setActiveLocation(location);

      expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { activeLocationPath: '1,2' } });
    });
  });
});
