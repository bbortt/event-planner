import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-project-create-modal-content',
  templateUrl: './project-create-modal.component.html',
})
export class ProjectCreateModalContentComponent {}

@Component({
  selector: 'app-project-create-modal',
  template: '',
})
export class ProjectCreateModalComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef | undefined;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    console.log('open modal');
    this.modalRef = this.modalService.open(ProjectCreateModalContentComponent, { size: 'lg' });
    this.modalRef.result.catch(() => window.history.back());
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
