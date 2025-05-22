// store/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User } from '../models/user.model';

export const initialState: User[] = [];

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess, (_, { users }) => [...users]),
  on(UserActions.addUserSuccess, (state, { user }) => [...state, user]),
  on(UserActions.deleteUserSuccess, (state, { userId }) => state.filter(u => u.id !== userId))
);
