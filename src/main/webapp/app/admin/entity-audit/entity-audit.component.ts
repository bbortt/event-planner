import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';

import { EntityAuditService } from './entity-audit.service';
import { EntityAuditEvent } from './entity-audit-event.model';
import { EntityAuditModalComponent } from './entity-audit-modal.component';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-entity-audit',
  templateUrl: './entity-audit.component.html',
  styles: [
    `
      .code {
        background: #dcdada;
        padding: 10px;
      }
    `,
  ],
})
export class EntityAuditComponent implements OnInit {
  audits: EntityAuditEvent[] = [];
  entities: string[] = [];
  selectedEntity?: string;
  limits = [25, 50, 100, 200];
  selectedLimit = this.limits[0];
  loading = false;
  filterEntityId = '';
  orderProp: keyof EntityAuditEvent = 'entityId';
  ascending = true;

  constructor(private modalService: NgbModal, private service: EntityAuditService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.service.getAllAudited().subscribe(entities => {
      this.entities = entities;
    });
  }

  loadChanges(): void {
    if (!this.selectedEntity) {
      return;
    }
    this.loading = true;
    this.service
      .findByEntity(this.selectedEntity, this.selectedLimit)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(res => {
        const data = res.body ?? [];
        this.audits = data.map((it: EntityAuditEvent) => {
          it.entityValue = JSON.parse(it.entityValue ?? '{}');
          return it;
        });
      });
  }

  trackId(index: number, item: EntityAuditEvent): number {
    return item.id;
  }

  openChange(audit: EntityAuditEvent): void {
    if (!audit.commitVersion || audit.commitVersion < 2) {
      this.alertService.addAlert({
        type: 'warning',
        translationKey: 'entityAudit.result.firstAuditEntry',
      });
    } else {
      const modalRef = this.modalService.open(EntityAuditModalComponent);
      modalRef.componentInstance.openChange(audit);
    }
  }

  orderBy(orderProp: keyof EntityAuditEvent): void {
    this.ascending = this.orderProp === orderProp ? !this.ascending : true;
    this.orderProp = orderProp;
  }

  getAudits(): EntityAuditEvent[] {
    return this.audits
      .filter(audit => !this.filterEntityId || audit.entityId.toString() === this.filterEntityId)
      .sort((a, b) => {
        const aOrderProp = a[this.orderProp];
        const bOrderProp = b[this.orderProp];
        if (
          (aOrderProp === undefined && bOrderProp === undefined) ||
          (aOrderProp !== undefined && bOrderProp !== undefined && aOrderProp === bOrderProp)
        ) {
          return 0;
        }
        if (aOrderProp === undefined || aOrderProp < bOrderProp) {
          return this.ascending ? -1 : 1;
        }
        return this.ascending ? 1 : -1;
      });
  }
}
