jest.mock('app/core/util/alert.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertService } from 'app/core/util/alert.service';

import { AlertComponent } from './alert.component';

describe('Alert Component', () => {
  let alertService: AlertService;

  let fixture: ComponentFixture<AlertComponent>;
  let comp: AlertComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [AlertService],
    })
      .overrideTemplate(AlertComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    alertService = TestBed.inject(AlertService);

    fixture = TestBed.createComponent(AlertComponent);
    comp = fixture.componentInstance;
  });

  it('Should call alertService.get on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(alertService.get).toHaveBeenCalled();
  });

  it('Should call alertService.clear on destroy', () => {
    // WHEN
    comp.ngOnDestroy();

    // THEN
    expect(alertService.clear).toHaveBeenCalled();
  });
});
