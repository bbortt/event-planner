import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { EventManager } from 'app/core/util/event-manager.service';

import { AppointmentEvent } from 'app/entities/scheduler/appointment-event';
import { SchedulerInformation } from 'app/entities/scheduler/scheduler-information';
import { SchedulerService } from 'app/entities/scheduler/scheduler.service';

import { SchedulerColorGroup } from 'app/entities/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';
import { SchedulerLocation } from 'app/entities/dto/scheduler-location.model';
import { SchedulerSection } from 'app/entities/dto/scheduler-section.model';

import { AccountService } from 'app/core/auth/account.service';
import { EventService } from 'app/entities/event/event.service';
import { LocationService } from 'app/entities/location/location.service';
import { SectionService } from 'app/entities/section/section.service';

import { Authority } from 'app/config/authority.constants';
import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Role } from 'app/config/role.constants';
import { Project } from 'app/entities/project/project.model';
import { Section } from 'app/entities/section/section.model';

import { faCog } from '@fortawesome/free-solid-svg-icons';

import * as dayjs from 'dayjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './project-calendar.component.html',
  styleUrls: ['./project-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCalendarComponent implements OnInit, OnDestroy {
  faCog = faCog;
  adminRoles = [Role.ADMIN.name, Role.SECRETARY.name];

  isViewer = true;
  schedulerInformation: SchedulerInformation = { allowDeleting: !this.isViewer };

  currentDate: Date = new Date();

  project?: Project;
  locations?: Location[];

  events: SchedulerEvent[] = [];
  sections: SchedulerSection[] = [];
  colors: SchedulerColorGroup[] = [];

  private eventSubscriber?: Subscription;

  constructor(
    private accountService: AccountService,
    private eventService: EventService,
    private sectionService: SectionService,
    private locationService: LocationService,
    private schedulerService: SchedulerService,
    private eventManager: EventManager,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap((data: Data) => {
          this.project = data.project as Project;
          this.currentDate = this.project.startTime.toDate();
          this.isViewer =
            !this.accountService.hasAnyAuthority(Authority.ADMIN) && this.accountService.hasAnyRole(this.project.id!, Role.VIEWER.name);
        }),
        switchMap((data: Data) => this.locationService.findAllByProject(data.project, { sort: ['name,asc'] })),
        map((res: HttpResponse<Location[]>) => res.body ?? []),
        tap((locations: Location[]) => (this.locations = locations)),
        tap(
          () =>
            (this.schedulerInformation = {
              ...this.schedulerInformation,
              allowAdding: !this.isViewer,
              allowDragging: !this.isViewer,
            })
        ),
        take(1)
      )
      .subscribe(() => {
        this.reset();
      });

    this.eventSubscriber = this.eventManager.subscribe('eventListModification', () => this.reset());
  }

  ngOnDestroy(): void {
    this.eventSubscriber?.unsubscribe();
  }

  currentDateChange($event: any): void {
    this.currentDate = $event;
  }

  configureAppointmentForm(appointmentEvent: AppointmentEvent): void {
    // Cancel devextreme form
    appointmentEvent.cancel = true;

    const event = appointmentEvent.appointmentData;
    const startTime = dayjs(event.startDate).toJSON();
    const endTime = dayjs(event.endDate).toJSON();

    const locationId = this.sections.find(section => section.id === event.sectionId)?.originalSection!.location.id;

    let route: (string | number)[] = [];
    if (locationId) {
      route = ['projects', this.project!.id!, 'locations', locationId, 'sections', event.sectionId, 'events'];

      if (event.originalEvent) {
        route.push(event.originalEvent.id!, 'edit');
      } else {
        route.push('new');
      }
    } else {
      route = ['projects', this.project!.id!, 'events', 'new'];
    }

    this.router.navigate([{ outlets: { modal: route } }], {
      queryParams: { startTime, endTime },
    });
  }

  /*
   * This is for the 'drag & drop' update (times only). Any click on an item results in `this.configureAppointmentForm` being called.
   */
  onAppointmentDragged(appointmentEvent: AppointmentEvent): void {
    this.updateDraggedEvent(appointmentEvent.appointmentData)
      .pipe(switchMap((event: Event) => this.eventService.update(event)))
      .subscribe(
        (response: HttpResponse<Event>) => {
          if (response.status !== 200) {
            this.reset();
          }
        },
        () => this.reset()
      );
  }

  /*
   * This may happen if a user clicks 'delete'.
   */
  onAppointmentDeleted(appointmentEvent: AppointmentEvent): void {
    this.eventService.delete(appointmentEvent.appointmentData.originalEvent!.id!).subscribe(
      (response: HttpResponse<{}>) => {
        if (response.status !== 200) {
          this.reset();
        }
      },
      () => this.reset()
    );
  }

  /*
   * Open `Event` details instead of the devextreme tooltip.
   */
  openEventDetails(appointmentEvent: AppointmentEvent): void {
    // Cancel devextreme tooltip
    appointmentEvent.cancel = true;

    const event = appointmentEvent.appointmentData;
    const route = [
      'projects',
      this.project!.id!,
      'locations',
      event.locationId,
      'sections',
      event.sectionId,
      'events',
      event.originalEvent!.id,
    ];
    this.router.navigate([{ outlets: { modal: route } }]);
  }

  private updateDraggedEvent(schedulerEvent: SchedulerEvent): Observable<Event> {
    return of(schedulerEvent).pipe(
      map(
        (event: SchedulerEvent) =>
          ({
            startTime: dayjs(event.startDate),
            endTime: dayjs(event.endDate),
            section: event.originalEvent?.section,
          } as Event)
      ),
      map((updatedEvent: Event) => ({ ...schedulerEvent.originalEvent, ...updatedEvent })),
      switchMap((updatedEvent: Event) =>
        schedulerEvent.sectionId === schedulerEvent.originalEvent?.section.id
          ? of(updatedEvent)
          : this.sectionService.find(schedulerEvent.sectionId).pipe(
              catchError(() => of({ body: schedulerEvent.originalEvent?.section } as HttpResponse<Section>)),
              switchMap((response: HttpResponse<Section>) => {
                if (response.body) {
                  updatedEvent.section = response.body;
                }

                return of(updatedEvent);
              })
            )
      )
    );
  }

  private reset(): void {
    combineLatest([...this.locations!.map((location: Location) => this.schedulerService.getSchedulerInformation(location))]).subscribe(
      (locations: SchedulerLocation[]) => {
        const newEvents: SchedulerEvent[] = [];
        const newSections: SchedulerSection[] = [];
        const newColors: SchedulerColorGroup[] = [];

        locations.forEach((location: SchedulerLocation) => {
          newEvents.push(...location.events);
          newSections.push(...location.sections);
          newColors.push(...location.colorGroups);
        });

        this.events = newEvents;
        this.sections = newSections;
        this.colors = newColors;
      }
    );
  }
}
