import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { LocationService } from '../service/location.service';

import LocationComponent from './location.component';

import SpyInstance = jest.SpyInstance;

describe('Location Management Component', () => {
  let service: LocationService;
  let routerNavigateSpy: SpyInstance<Promise<boolean>>;

  let fixture: ComponentFixture<LocationComponent>;
  let component: LocationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'location', component: LocationComponent }]),
        HttpClientTestingModule,
        LocationComponent,
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
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LocationComponent, '')
      .compileComponents();

    service = TestBed.inject(LocationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;

    // @ts-ignore: force this private property value for testing.
    routerNavigateSpy = jest.spyOn(component.router, 'navigate');
  });

  it('Should call load all on init', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(component.locations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to locationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLocationIdentifier');
      const id = component.trackId(0, entity);
      expect(service.getLocationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });

  it('should load a page', () => {
    // WHEN
    component.navigateToPage(1);

    // THEN
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['id,desc'] }));
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // GIVEN
    component.predicate = 'name';

    // WHEN
    component.navigateToWithComponentValues();

    // THEN
    expect(routerNavigateSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        queryParams: expect.objectContaining({
          sort: ['name,asc'],
        }),
      }),
    );
  });
});
