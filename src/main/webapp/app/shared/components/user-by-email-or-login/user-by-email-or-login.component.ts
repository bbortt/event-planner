import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { UserService } from 'app/core/user/user.service';
import { IRole } from 'app/shared/model/role.model';
import { IUser } from 'app/core/user/user.model';

import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/autocomplete';

import { DEFAULT_DEBOUNCE } from 'app/app.constants';

type SelectableEntity = IUser;

@Component({
  selector: 'app-user-by-email-or-login',
  templateUrl: './user-by-email-or-login.component.html',
  styleUrls: ['./user-by-email-or-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserByEmailOrLoginComponent implements OnInit, OnDestroy {
  @Output()
  userSelected = new EventEmitter<IUser>();

  users: IUser[] = [];
  editForm = this.formBuilder.group({
    emailOrLogin: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(254)]],
  });

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.editForm
      .get('emailOrLogin')!
      .valueChanges.pipe(takeUntil(this.destroy$), debounceTime(DEFAULT_DEBOUNCE))
      .subscribe((value: string) => this.updateSelectedValueOrSearch(value));

    // Initialize autocomplete, prepare jquery-ui
    this.autocompleteUsingSource([]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  autocompleteUsingSource(source: (string | undefined)[]): void {
    ($('#field_emailOrLogin') as any).autocomplete({
      source,
      appendTo: $('#field_emailOrLogin_result'),
      select: (event: any, ui: any): void => {
        this.editForm?.get('emailOrLogin')!.setValue(ui.item.value);
      },
    });
  }

  private updateSelectedValueOrSearch(value: string): void {
    const selectedUser = this.findUserByLoginOrEmailFromList(value);

    if (selectedUser) {
      this.userSelected.emit(selectedUser);
    } else {
      this.refreshUsers(value);
    }
  }

  findUserByLoginOrEmailFromList(value: string): IUser | undefined {
    return this.users.find((user: IUser) => user.login === value || user.email === value);
  }

  refreshUsers(value: string): void {
    this.userService.findByEmailOrLogin(value).subscribe((users: IUser[]) => {
      this.users = users;

      this.autocompleteUsingSource(this.users.map(user => (user.login?.includes(value) ? user.login : user.email)));
    });
  }

  trackById(index: number, item: SelectableEntity): any {
    if (item['id']) {
      return item['id'];
    }

    return (item as IRole).name;
  }
}
