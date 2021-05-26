import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { EventHistoryService } from 'app/entities/event-history/event-history.service';

import { ProjectEventHistoryComponent } from 'app/view/project/admin/history/project-event-history.component';

import * as dayjs from 'dayjs';

jest.mock('@angular/router');

describe('Component Tests', () => {
  describe('Project Event History Component', () => {
    let comp: ProjectEventHistoryComponent;
    let fixture: ComponentFixture<ProjectEventHistoryComponent>;
    let service: EventHistoryService;
    let router: Router;

    const project = { id: 2345 };
    const data = of({
      defaultSort: 'id,asc',
      project,
    });
    let queryParamMap = of(
      jest.requireActual('@angular/router').convertToParamMap({
        page: '1',
        size: '1',
        sort: 'id,desc',
      })
    );

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, TranslateModule.forRoot()],
          declarations: [ProjectEventHistoryComponent],
          providers: [
            Router,
            {
              provide: ActivatedRoute,
              useValue: { data, queryParamMap },
            },
          ],
        })
          .overrideTemplate(ProjectEventHistoryComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ProjectEventHistoryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EventHistoryService);
      router = TestBed.inject(Router);
    });

    describe('OnInit', () => {
      it('Should call load all on init', fakeAsync(() => {
        // GIVEN
        const headers = new HttpHeaders().append('link', 'link;link');
        spyOn(service, 'query').and.returnValue(
          of(
            new HttpResponse({
              body: [{ id: 123 }],
              headers,
            })
          )
        );

        // WHEN
        comp.ngOnInit();
        tick(); // simulate async

        // THEN
        expect(service.query).toHaveBeenCalled();
        expect(comp.eventHistory[0]).toEqual(jasmine.objectContaining({ id: 123 }));
      }));

      it('Should save ActivatedRoute data', fakeAsync(() => {
        // GIVEN
        const showSince = new Date();
        queryParamMap = of(new Map([['showSince', showSince.toJSON()]]));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        comp.activatedRoute = { data, queryParamMap };

        spyOn(comp.showSinceFormControl, 'setValue');

        // WHEN
        comp.ngOnInit();
        tick(); // simulate async

        // THEN
        expect(comp.project).toEqual(project);
        expect(comp.showSinceFormControl.setValue).toHaveBeenCalledWith(showSince.toJSON());
      }));
    });

    describe('showSinceFormControl', () => {
      it('Should trigger a reload on value change', fakeAsync(() => {
        // GIVEN
        const date = new Date();
        spyOn(router, 'navigate');

        // WHEN
        comp.ngOnInit();
        tick();
        comp.showSinceFormControl.setValue(date);
        tick();

        // THEN
        expect(router.navigate).toHaveBeenCalledWith(['.'], {
          relativeTo: { data, queryParamMap },
          queryParams: {
            showSince: dayjs(date).toJSON(),
          },
        });
      }));
    });
  });
});
