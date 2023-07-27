import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import ProjectDetailComponent from './project-detail.component';

describe('Project Management Detail Component', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProjectDetailComponent,
              resolve: { project: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProjectDetailComponent, '')
      .compileComponents();
  }));

  describe('OnInit', () => {
    it('Should load project on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProjectDetailComponent);

      expect(instance.project).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
