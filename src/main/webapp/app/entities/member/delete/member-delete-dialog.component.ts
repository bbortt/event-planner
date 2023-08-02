import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

import SharedModule from 'app/shared/shared.module';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

@Component({
  standalone: true,
  templateUrl: './member-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export default class MemberDeleteDialogComponent {
  member?: IMember;

  constructor(protected memberService: MemberService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.memberService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
