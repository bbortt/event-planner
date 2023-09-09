import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDay } from 'calendar-utils';

import dayjs from 'dayjs/esm';

import { ProjectCalendarModule } from './project-calendar.module';
import { ProjectCalendarWeekViewComponent } from './project-calendar-week-view.component';

describe('Project Calendar Week View', () => {
  let fixture: ComponentFixture<ProjectCalendarWeekViewComponent>;
  let component: ProjectCalendarWeekViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCalendarModule],
      declarations: [ProjectCalendarWeekViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCalendarWeekViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set viewDate to initialViewDate', () => {
      const initialViewDate = dayjs('2023-09-09');
      component.initialViewDate = initialViewDate;

      component.ngOnInit();

      // @ts-ignore: force this private property value for testing
      expect(component.viewDate).toEqual(initialViewDate);
    });
    it('should set viewDate to current date if no initialViewDate present', () => {
      component.ngOnInit();

      // @ts-ignore: force this private property value for testing
      expect(component.viewDate).not.toBeUndefined();
    });
  });

  describe('beforeWeekViewRender', () => {
    it('should disable days outside the project range', () => {
      const projectStartDate = dayjs('2023-09-01');
      const projectEndDate = dayjs('2023-09-15');
      component.projectStartDate = projectStartDate;
      component.projectEndDate = projectEndDate;

      const calendarWeekViewBeforeRenderEvent: { header: WeekDay[] } = {
        header: [
          { date: dayjs('2023-08-31').toDate() },
          { date: dayjs('2023-09-01').toDate() },
          { date: dayjs('2023-09-10').toDate() },
          { date: dayjs('2023-09-15').toDate() },
          { date: dayjs('2023-09-20').toDate() },
        ] as WeekDay[],
      };

      // @ts-ignore: force this private property value for testing
      component.beforeWeekViewRender(calendarWeekViewBeforeRenderEvent);

      const { header } = calendarWeekViewBeforeRenderEvent;

      expect(header.length).toEqual(5);

      expect(header[0].cssClass).toEqual('cal-disabled');
      expect(header[1].cssClass).toBeUndefined();
      expect(header[2].cssClass).toBeUndefined();
      expect(header[3].cssClass).toBeUndefined();
      expect(header[4].cssClass).toEqual('cal-disabled');
    });
  });
});
