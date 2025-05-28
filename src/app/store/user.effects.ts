import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { UserService } from '../services/user.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { mapBackendUserToUser } from '../shared/backend-user/backend-user.mapper';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map(users =>
            UserActions.loadUsersSuccess({
              users: users.map(mapBackendUserToUser)
            })
          ),
          catchError(error =>
            of(UserActions.loadUsersFailure({ error }))
          )
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap(({ user }) =>
        this.userService.addUser(user).pipe(
          map(newUser =>
            UserActions.addUserSuccess({
              user: mapBackendUserToUser(newUser)
            })
          ),
          catchError(error =>
            of(UserActions.addUserFailure({ error }))
          )
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ userId }) =>
        this.userService.deleteUser(userId).pipe(
          map(() => UserActions.deleteUserSuccess({ userId })),
          catchError(error =>
            of(UserActions.deleteUserFailure({ error }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          tap(updatedUser => console.log('Réponse backend updateUser:', updatedUser)), // <-- ici
          map(updatedUser =>
            UserActions.updateUserSuccess({
              user: mapBackendUserToUser(updatedUser)
            })
          ),
          catchError(error =>
            of(UserActions.updateUserFailure({ error }))
          )
        )
      )
    )
  );
}
