import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import EventDetailComponent from './event-detail.component';

describe('Event Management Detail Component', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EventDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EventDetailComponent,
              resolve: { event: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EventDetailComponent, '')
      .compileComponents();
  }));

  describe('OnInit', () => {
    it('Should load event on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EventDetailComponent);

      expect(instance.event).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
