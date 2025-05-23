import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../../store/user.actions';
import { User } from '../../models/user.model';
import { selectAllUsers } from '../../store/user.selectors';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadUsers } from '../../store/user.actions';
import { BackendUser } from '../../shared/backend-user/backend-user';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  userForm: FormGroup;
  users$: Observable<User[]>;
  pseudoDejaPris = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    // Initialisation du formulaire
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      pseudo: ['', Validators.required],
      statut: ['standard', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
    });
    this.store.dispatch(loadUsers());
    // Transformation des utilisateurs backend → modèle frontend
    this.users$ = this.store.select(selectAllUsers).pipe(
      map((users: BackendUser[]) =>
        users.map(user => ({
          id: user.id,
          nom: user.nom || user.name || '',
          pseudo: user.pseudo || user.username || '',
          statut: user.statut || user.status || 'standard',
          budget: user.budget ?? 0,
        }))
      )
    );
  }

  async onSubmit() {
    this.userForm.markAllAsTouched();
  
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();
      const enteredPseudo = formData.pseudo?.trim().toLowerCase();
  
      if (!enteredPseudo) {
        this.pseudoDejaPris = true;
        return;
      }
  
      // Récupération asynchrone des users
      const users = await firstValueFrom(this.users$);
  
      // Debug : affiche tous les pseudos
      console.log('Pseudos existants:', users.map(u => u.pseudo.toLowerCase()));
  
      // Vérifie si pseudo déjà pris
      const isTaken = users.some(user => user.pseudo.toLowerCase() === enteredPseudo);
  
      if (isTaken) {
        this.pseudoDejaPris = true;
        return;
      }
  
      // Création utilisateur
      const newUser: User = {
        id: uuidv4(),
        nom: formData.nom,
        pseudo: enteredPseudo,
        statut: formData.statut,
        budget: formData.budget,
      };
  
      // Dispatch action ajout utilisateur
      this.store.dispatch(addUser({ user: newUser }));
  
      // Reset formulaire + état erreur
      this.userForm.reset({ statut: 'standard', budget: 0 });
      this.pseudoDejaPris = false;
  
      // Message succès
      this.snackBar.open('Utilisateur ajouté avec succès 🎉', 'Fermer', {
        duration: 3000,
        panelClass: ['custom-toast'],
      });
  
      // Navigation
      this.router.navigate(['/user-list']);
    }
  }
  
}
