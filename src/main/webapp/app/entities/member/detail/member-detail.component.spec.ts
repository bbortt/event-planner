import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MemberDetailComponent } from './member-detail.component';

describe('Member Management Detail Component', () => {
  let comp: MemberDetailComponent;
  let fixture: ComponentFixture<MemberDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ member: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MemberDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MemberDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load member on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.member).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
