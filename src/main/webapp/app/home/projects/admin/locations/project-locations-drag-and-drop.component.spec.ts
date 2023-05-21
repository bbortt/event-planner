import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of, Subscription } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

import { ProjectLocationsDragAndDropComponent } from './project-locations-drag-and-drop.component';

const project = { token: 'aaa89f38-c222-4530-b983-6c9b70f26609' } as Project;

describe("Project Locations Drag 'n Drop Component", () => {
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
          },
        },
        LocationService,
        ProjectLocationService,
      ],
    }).compileComponents();

    mockTranslateService = TestBed.inject(TranslateService);
    jest.spyOn(mockTranslateService, 'get').mockImplementation((key: string | string[]) => of(`${key as string} translated`));

    component = TestBed.createComponent(ProjectLocationsDragAndDropComponent).componentInstance;
  });

  describe('ngOnInit', () => {
    it('loads project from route', () => {
      component.ngOnInit();

      expect(component.project).toEqual(project);
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
    it('sets the active location', () => {
      const location = {} as Location;

      component.setActiveLocation(location);

      expect(component.activeLocation).toEqual(location);
    });

    it('calculates the active location path', () => {
      const location: Location = {
        id: 4,
        name: 'Location 4',
        children: [],
      };

      const locations: Location[] = [
        {
          id: 1,
          name: 'Location 1',
          children: [
            {
              id: 2,
              name: 'Location 2',
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
          id: 5,
          name: 'Location 5',
          children: [],
        },
      ];

      component.locations = locations;
      component.setActiveLocation(location);

      expect(component.activeLocationPath).toEqual([locations[0], locations[0].children[1], location]);
    });
  });
});
