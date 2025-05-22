import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { selectAllUsers } from '../../store/user.selectors';
import { loadUsers, deleteUser } from '../../store/user.actions';

import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  showToast = false;
  toastMessage = '';
  searchTerm: string = '';
  selectedStatus: string = 'all';

  constructor(private store: Store, private dialog: MatDialog) {
    this.users$ = this.store.select(selectAllUsers);
  }

  ngOnInit(): void {
    // Charger les utilisateurs depuis l'API au démarrage
    this.store.dispatch(loadUsers());
  }

  remove(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Voulez-vous vraiment supprimer cet utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(deleteUser({ userId: id }));
        this.toastMessage = 'Utilisateur supprimé avec succès !';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
      }
    });
  }

  filteredUsers(users: User[] | null): User[] {
    if (!users) return [];
    return users.filter(user =>
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedStatus === 'all' || user.statut === this.selectedStatus)
    );
  }
  
  

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
  }
}
