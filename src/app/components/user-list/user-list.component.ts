import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { selectAllUsers } from '../../store/user.selectors';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  users$: Observable<User[]>;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectAllUsers);
  }
}
