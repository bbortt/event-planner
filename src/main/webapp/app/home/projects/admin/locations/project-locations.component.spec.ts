import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of, Subscription } from 'rxjs';

import { Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

import { ProjectLocationsComponent } from './project-locations.component';

const project = { token: 'aaa89f38-c222-4530-b983-6c9b70f26609' } as Project;

describe('ProjectLocationsComponent', () => {
  let component: ProjectLocationsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProjectLocationsComponent],
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

    component = TestBed.createComponent(ProjectLocationsComponent).componentInstance;
  });

  describe('ngOnInit', () => {
    it('loads project from route', () => {
      component.ngOnInit();

      expect(component.project).toEqual(project);
      // @ts-ignore: force this private property value for testing.
      expect(component.locationUpdatedSource).not.toBeNull();
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
});
