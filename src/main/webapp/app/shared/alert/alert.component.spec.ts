jest.mock('app/core/util/alert.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertService } from 'app/core/util/alert.service';

import AlertComponent from './alert.component';

describe('Alert Component', () => {
  let mockAlertService: AlertService;

  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlertComponent],
      providers: [AlertService],
    })
      .overrideTemplate(AlertComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    mockAlertService = TestBed.inject(AlertService);
  });

  it('Should call alertService.get on init', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(mockAlertService.get).toHaveBeenCalled();
  });

  it('Should call alertService.clear on destroy', () => {
    // WHEN
    component.ngOnDestroy();

    // THEN
    expect(mockAlertService.clear).toHaveBeenCalled();
  });
});
