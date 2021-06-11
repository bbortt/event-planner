import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, take, tap } from 'rxjs/operators';
import { SchedulerSection } from 'app/entities/dto/scheduler-section.model';
import { IDropdownSettings, ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { TranslateService } from '@ngx-translate/core';

export const ROUTE_ACTIVE_SECTIONS_PARAMETER_NAME = 'activeSections';

@Component({
  selector: 'app-project-calendar-filter',
  templateUrl: './project-calendar-filter.component.html',
  styleUrls: ['./project-calendar-filter.component.scss'],
})
export class ProjectCalendarFilterComponent implements OnInit {
  @Input() schedulerSections: SchedulerSection[] = [];
  @Output() activeSectionsChanged = new EventEmitter<number[]>();

  items: ListItem[] = [];
  selectedItems: ListItem[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    searchPlaceholderText: 'Search',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  private activeSections: SchedulerSection[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.items = this.toListItems(this.schedulerSections);

    this.activatedRoute.queryParams
      .pipe(
        take(1),
        map((params: Params) => params[ROUTE_ACTIVE_SECTIONS_PARAMETER_NAME] as string | string[]),
        map((params: string | string[]) => (typeof params === 'string' ? [params] : params)),
        filter((activeSectionIds: string[]) => !!activeSectionIds),
        map((activeSectionIds: string[]) =>
          activeSectionIds.map((activeSectionId: string) => this.findSectionById(parseInt(activeSectionId, 10))!)
        ),
        tap((activeSections: SchedulerSection[]) => (this.activeSections = activeSections)),
        map((activeSections: SchedulerSection[]) => this.toListItems(activeSections))
      )
      .subscribe((listItems: ListItem[]) => {
        this.selectedItems = listItems;
        this.afterFilterChange();
      });

    this.translateService
      .get('eventPlannerApp.project.calendar.filter.selectAll', 'Select All')
      .subscribe((translation: string) => (this.dropdownSettings.selectAllText = translation));
    this.translateService
      .get('eventPlannerApp.project.calendar.filter.deselectAll', 'Deselect All')
      .subscribe((translation: string) => (this.dropdownSettings.unSelectAllText = translation));
    this.translateService
      .get('global.form.search', 'Search')
      .subscribe((translation: string) => (this.dropdownSettings.searchPlaceholderText = translation));
  }

  onSelect(listItem: ListItem): void {
    this.activeSections.push(this.toSchedulerSection(listItem));
    this.afterFilterChange();
  }

  onSelectAll(listItems: Array<ListItem>): void {
    this.activeSections = this.toSchedulerSections(listItems);
    this.afterFilterChange();
  }

  onDeSelect(listItem: ListItem): void {
    this.activeSections.splice(this.activeSections.indexOf(this.toSchedulerSection(listItem)), 1);
    this.afterFilterChange();
  }

  onDeSelectAll(): void {
    this.activeSections = [];
    this.afterFilterChange();
  }

  private toListItems(activeSections: SchedulerSection[]): ListItem[] {
    return activeSections.map((activeSection: SchedulerSection) => this.toListItem(activeSection));
  }

  private toListItem(activeSection: SchedulerSection): ListItem {
    const { id, text } = activeSection;
    return { id, text };
  }

  private toSchedulerSections(listItems: ListItem[]): SchedulerSection[] {
    return listItems.map((listItem: ListItem) => this.toSchedulerSection(listItem));
  }

  private toSchedulerSection(listItem: ListItem): SchedulerSection {
    return this.schedulerSections.find((schedulerSection: SchedulerSection) => schedulerSection.id === listItem.id)!;
  }

  private findSectionById(id: number): SchedulerSection {
    return this.schedulerSections.find((schedulerSection: SchedulerSection) => schedulerSection.id === id)!;
  }

  private afterFilterChange(): void {
    this.activeSectionsChanged.emit(this.activeSectionIds());

    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        [ROUTE_ACTIVE_SECTIONS_PARAMETER_NAME]: this.activeSectionIds(),
      },
      queryParamsHandling: 'merge',
    });
  }

  private activeSectionIds(): number[] {
    return this.activeSections.map((schedulerSection: SchedulerSection) => schedulerSection.id);
  }
}
