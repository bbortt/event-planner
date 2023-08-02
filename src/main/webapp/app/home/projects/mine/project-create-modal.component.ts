import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import ProjectUpdateComponent from 'app/entities/project/update/project-update.component';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-project-create-modal-content',
  templateUrl: './project-create-modal.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ProjectUpdateComponent],
})
export class ProjectCreateModalContentComponent {}

@Component({
  standalone: true,
  selector: 'app-project-create-modal',
  template: '',
  imports: [ProjectCreateModalContentComponent],
})
export default class ProjectCreateModalComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef | undefined;

  constructor(private location: Location, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.modalRef = this.modalService.open(ProjectCreateModalContentComponent, { size: 'lg' });
    this.modalRef.result.catch(() => this.location.back());
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
