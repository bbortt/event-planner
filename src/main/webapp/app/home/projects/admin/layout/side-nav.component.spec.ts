import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { of, Subject } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IProject } from '../../../../entities/project/project.model';

import { SideNavComponent } from './side-nav.component';

describe('Side Nav Component', () => {
  let comp: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  let titleService: Title;
  let translateService: TranslateService;

  let mockRouter: Router;
  const routerEventsSubject = new Subject<RouterEvent>();

  class MockRouter {
    events = routerEventsSubject;
    url = '/admin/settings';
  }

  const mockProject = { name: 'test-project' } as IProject;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SideNavComponent],
      providers: [
        {
          provide: Router,
          useClass: MockRouter,
        },
      ],
    })
      .overrideTemplate(SideNavComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    comp = fixture.componentInstance;

    (comp.project = mockProject), (titleService = TestBed.inject(Title));
    translateService = TestBed.inject(TranslateService);

    mockRouter = TestBed.inject(Router);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(translateService, 'get').mockImplementation((key: string | string[]) => of(`${key as string} translated`));
      translateService.currentLang = 'de';

      jest.spyOn(titleService, 'setTitle');
    });

    describe('should synchronize title based on current route', () => {
      it('for settings', () => {
        // @ts-ignore: force this private property value for testing.
        mockRouter.url = '/admin/settings';

        comp.ngOnInit();

        expect(translateService.get).toHaveBeenCalledWith('global.menu.account.settings');
        expect(titleService.setTitle).toHaveBeenCalledWith('global.menu.account.settings translated: test-project');
      });

      it('for members', () => {
        // @ts-ignore: force this private property value for testing.
        mockRouter.url = '/admin/members';

        comp.ngOnInit();

        expect(translateService.get).toHaveBeenCalledWith('app.member.home.title');
        expect(titleService.setTitle).toHaveBeenCalledWith('app.member.home.title translated: test-project');
      });
    });

    describe('should subscribe to route changes', () => {
      beforeEach(() => {
        comp.ngOnInit();
      });

      test('then update the title on navigation end', () => {
        routerEventsSubject.next(new NavigationEnd(1, '/admin/settings', ''));

        expect(translateService.get).toHaveBeenCalledWith('global.menu.account.settings');
        expect(titleService.setTitle).toHaveBeenCalledWith('global.menu.account.settings translated: test-project');
      });
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      jest.spyOn(routerEventsSubject, 'unsubscribe');
      jest.resetAllMocks();
    });

    test('should unsubscribe from router events', () => {
      // @ts-ignore: force this private property value for testing.
      comp.routerSubscription = routerEventsSubject;

      comp.ngOnDestroy();

      expect(routerEventsSubject.unsubscribe).toHaveBeenCalled();
    });

    test('should not fail if it did not subscribe to router events', () => {
      // @ts-ignore: force this private property value for testing.
      comp.routerSubscription = null;

      comp.ngOnDestroy();

      expect(routerEventsSubject.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
