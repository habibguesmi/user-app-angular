import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../../store/user.actions';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  userForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private store: Store) {
    this.userForm = this.fb.group({
      nom: [''],
      pseudo: [''],
      statut: ['standard'],
      budget: [0]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser: User = {
        id: uuidv4(),
        ...this.userForm.value
      };
      this.store.dispatch(addUser({ user: newUser }));
      this.userForm.reset({ statut: 'standard', budget: 0 });
    }
  }
}
