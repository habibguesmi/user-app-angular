import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../../store/user.actions';
import { User } from '../../models/user.model';
import { selectAllUsers } from '../../store/user.selectors';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'] 
})
export class AddUserComponent {
  userForm: FormGroup;
  users: User[] = [];
  pseudoDejaPris = false;
  submitted = false;
  showToast = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      pseudo: ['', Validators.required],
      statut: ['standard', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]]
    });
    // Récupère la liste actuelle des utilisateurs
    this.store.select(selectAllUsers).subscribe(users => {
      this.users = users;
    });
  }
    
  

  onSubmit() {
    this.submitted = true;
    this.userForm.updateValueAndValidity();
    this.userForm.markAllAsTouched(); // ⬅️ Active les erreurs partout

  
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();
    
      const enteredPseudo = this.userForm.get('pseudo')?.value.trim();

      const pseudoExists = this.users.some(user => user.pseudo.toLowerCase() === enteredPseudo.toLowerCase());
  
      if (pseudoExists) {
        this.pseudoDejaPris = true;
        return;
      }
      const newUser: User = {
        id: uuidv4(),
        ...formData
      };
  
      this.store.dispatch(addUser({ user: newUser }));
  
     
      this.userForm.reset({ statut: 'standard', budget: 0 });
      this.pseudoDejaPris = false;
       // ✅ Affiche un toast de confirmation
  this.snackBar.open('Utilisateur ajouté avec succès 🎉', 'Fermer', {
    duration: 3000,
    panelClass: ['custom-toast'],
  });

  // ✅ Redirige vers la liste
  this.router.navigate(['/user-list']);
      
      
    }
    
  }
  
  
  
}
