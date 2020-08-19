import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { IRole } from 'app/shared/model/role.model';
import { IUser } from 'app/core/user/user.model';

type SelectableEntity = IUser;

@Component({
  selector: 'jhi-user-by-email-or-login',
  templateUrl: './user-by-email-or-login.component.html',
})
export class UserByEmailOrLoginComponent implements OnInit {
  @Output()
  userSelected = new EventEmitter<IUser>();

  users: IUser[] = [];
  editForm = this.fb.group({
    emailOrLogin: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(254)]],
  });

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm?.get('emailOrLogin')?.valueChanges.subscribe((value: string) => this.updateSelectedValueOrSearch(value));
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
    this.userService.findByEmailOrLogin(value).subscribe((users: IUser[]) => (this.users = users));
  }

  trackById(index: number, item: SelectableEntity): any {
    if (item['id']) {
      return item['id'];
    }

    return (item as IRole).name;
  }
}
