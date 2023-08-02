import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import MemberDetailComponent from './member-detail.component';

describe('Member Management Detail Component', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MemberDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MemberDetailComponent,
              resolve: { member: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(MemberDetailComponent, '')
      .compileComponents();
  }));

  describe('OnInit', () => {
    it('Should load member on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MemberDetailComponent);

      expect(instance.member).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
