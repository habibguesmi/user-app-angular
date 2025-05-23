import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import * as UserActions from './user.actions';

export interface UserState {
  users: User[];
  error: any;
}

export const initialState: UserState = {
  users: [],
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, error: null })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error })),

  on(UserActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    error: null,
  })),
  on(UserActions.addUserFailure, (state, { error }) => ({ ...state, error })),

  on(UserActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId),
    error: null,
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, error })),
);
