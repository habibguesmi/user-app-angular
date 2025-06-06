
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { addUser, loadUsers, updateUser } from '../../store/user.actions';
import { selectAllUsers } from '../../store/user.selectors';
import { User } from '../../models/user.model';
import { BackendUser } from '../../shared/backend-user/backend-user';
import { mapBackendUserToUser } from '../../shared/backend-user/backend-user.mapper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  editMode = false;
  editedUserId: string | null = null;
  pseudoDejaPris = false;

  allUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private title: Title,
    private meta: Meta
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editedUserId = id;
    }
    if (this.editMode) {
      this.title.setTitle('Modifier un utilisateur | Application Gestion Utilisateurs');
      this.meta.updateTag({
        name: 'description',
        content: 'Modifier des utilisateurs.'
      });
    }
    else {
      this.title.setTitle('Ajouter un utilisateur | Application Gestion Utilisateurs');
      this.meta.updateTag({
        name: 'description',
        content: 'Ajouter des utilisateurs.'
      });
      
    }
    this.store.dispatch(loadUsers());

    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      pseudo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s]+$/) // ❌ interdit tout espace
        ]
      ],
      statut: ['standard', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]]
    });

    this.store.select(selectAllUsers).subscribe((backendUsers: BackendUser[]) => {
      this.allUsers = backendUsers.map(mapBackendUserToUser);
    
      if (this.editMode && this.editedUserId) {
        const userToEdit = this.allUsers.find(u => u.id == this.editedUserId);
          
        if (userToEdit) {
          this.userForm.patchValue({
            nom: userToEdit.nom,
            pseudo: userToEdit.pseudo,
            statut: userToEdit.statut,
            budget: userToEdit.budget
          });
                   
        }
      }
    });
    
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const newUser: User = {
      ...this.userForm.value,
      id: this.editedUserId || crypto.randomUUID()
    };
    const newPseudo = newUser.pseudo.trim().toLowerCase();

    const pseudoExists = this.allUsers.some(
      user =>
        user.pseudo.trim().toLowerCase() === newPseudo &&
        String(user.id) !== String(this.editedUserId)
    );

    if (pseudoExists) {
      this.pseudoDejaPris = true;
      return;
    }

    if (this.editMode) {
      this.store.dispatch(updateUser({ user: newUser }));
    } else {
      this.store.dispatch(addUser({ user: newUser }));
    }

    this.snackBar.open(
      this.editMode ? 'Utilisateur modifié ✅' : 'Utilisateur ajouté 🎉',
      'Fermer',
      { duration: 3000, panelClass: ['custom-toast'] }
    );
    this.router.navigate(['/user-list']);
  }
}

