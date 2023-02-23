import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjectDetailComponent } from './project-detail.component';

describe('Project Management Detail Component', () => {
  let comp: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ project: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProjectDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProjectDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load project on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.project).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
