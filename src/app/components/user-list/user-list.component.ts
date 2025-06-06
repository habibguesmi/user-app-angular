import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { User } from '../../models/user.model';
import { selectAllUsers } from '../../store/user.selectors';
import { loadUsers, deleteUser } from '../../store/user.actions';

import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { BackendUser } from '../../shared/backend-user/backend-user';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;           // tous les users depuis le store
  filteredUsers$: Observable<User[]>;   // users filtrés en fonction des filtres

  searchTermSubject = new BehaviorSubject<string>('');  
  selectedStatusSubject = new BehaviorSubject<string>('all');

  showToast = false;
  toastMessage = '';
  editMode = false;
  editedUserId: string | null = null;
  

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
           
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
    

    // Combine users + filtres pour calculer filteredUsers$
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchTermSubject.asObservable().pipe(startWith('')),
      this.selectedStatusSubject.asObservable().pipe(startWith('all'))
    ]).pipe(
      map(([users, searchTerm, selectedStatus]) =>
        users.filter(user => {
          const nom = user.nom || '';
          const search = searchTerm || '';
          return nom.toLowerCase().includes(search.toLowerCase()) &&
            (selectedStatus === 'all' || user.statut === selectedStatus);
        })
      )
    );
  }

  ngOnInit() {
    this.title.setTitle('Liste des utilisateurs | Application Gestion Utilisateurs');
    this.meta.updateTag({
      name: 'description',
      content: 'Liste des utilisateurs.'
    });
    this.store.dispatch(loadUsers());
  }
  

  onSearchTermChange(term: string) {
    this.searchTermSubject.next(term);
  }

  onStatusChange(status: string) {
    this.selectedStatusSubject.next(status);
  }

  resetFilters() {
    this.searchTermSubject.next('');
    this.selectedStatusSubject.next('all');
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

  edit(userId: string) {
    this.router.navigate(['/edit-user', userId]);
  }
   
}
