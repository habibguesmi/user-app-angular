import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import * as UserActions from './user.actions';
import { mapBackendUserToUser } from '../shared/backend-user/backend-user.mapper';

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
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users.map(mapBackendUserToUser), // <-- mapping ici
    error: null
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error })),

  on(UserActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, mapBackendUserToUser(user)],
    error: null,
  })),
  on(UserActions.addUserFailure, (state, { error }) => ({ ...state, error })),

  on(UserActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId),
    error: null,
  })), 
  on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, error })),

  on(UserActions.updateUserSuccess, (state, { user }) =>{
    console.log('Reducer reçoit:', user);
    return{
      ...state,
      users: state.users.map(u => u.id === user.id ? mapBackendUserToUser(user) : u),
      error: null,
    };
  }),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
);
