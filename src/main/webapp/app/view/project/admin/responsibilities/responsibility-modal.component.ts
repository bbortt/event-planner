import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Responsibility } from 'app/shared/model/responsibility.model';

import { ResponsibilityUpdateComponent } from 'app/view/project/admin/responsibilities/responsibility-update.component';

@Component({
  template: '',
  styleUrls: ['./responsibility-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResponsibilityModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private eventManager: JhiEventManager, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe(({ project, responsibility }) => {
      this.modalRef = this.modalService.open(ResponsibilityUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });
      (this.modalRef.componentInstance as ResponsibilityUpdateComponent).updateForm(
        project,
        responsibility ? responsibility : new Responsibility()
      );
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.eventManager.broadcast('responsibilityListModification');
  }
}
