import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMonthViewDay } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { CalendarMetaModel } from './event-to-calendar-event';
import { ProjectCalendarModule } from './project-calendar.module';
import { ProjectCalendarMonthViewComponent } from './project-calendar-month-view.component';

describe('Project Calendar Month View', () => {
  let fixture: ComponentFixture<ProjectCalendarMonthViewComponent>;
  let component: ProjectCalendarMonthViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCalendarModule],
      declarations: [ProjectCalendarMonthViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCalendarMonthViewComponent);
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

  describe('beforeMonthViewRender', () => {
    it('should disable days outside the project range', () => {
      const projectStartDate = dayjs('2023-09-01');
      const projectEndDate = dayjs('2023-09-15');
      component.projectStartDate = projectStartDate;
      component.projectEndDate = projectEndDate;

      const calendarMonthViewBeforeRenderEvent: { body: CalendarMonthViewDay<CalendarMetaModel>[] } = {
        body: [
          { date: dayjs('2023-08-31').toDate() },
          { date: dayjs('2023-09-01').toDate() },
          { date: dayjs('2023-09-10').toDate() },
          { date: dayjs('2023-09-15').toDate() },
          { date: dayjs('2023-09-20').toDate() },
        ] as CalendarMonthViewDay<CalendarMetaModel>[],
      };

      // @ts-ignore: force this private property value for testing
      component.beforeMonthViewRender(calendarMonthViewBeforeRenderEvent);

      const { body } = calendarMonthViewBeforeRenderEvent;

      expect(body.length).toEqual(5);

      expect(body[0].cssClass).toEqual('cal-disabled');
      expect(body[1].cssClass).toBeUndefined();
      expect(body[2].cssClass).toBeUndefined();
      expect(body[3].cssClass).toBeUndefined();
      expect(body[4].cssClass).toEqual('cal-disabled');
    });
  });
});
