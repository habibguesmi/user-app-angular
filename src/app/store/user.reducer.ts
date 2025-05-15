import { createReducer, on } from '@ngrx/store';
import { addUser, removeUser } from './user.actions';
import { User } from '../models/user.model';

export const initialState: User[] = [];

export const userReducer = createReducer(
  initialState,
  on(addUser, (state, { user }) => [...state, user]),
  on(removeUser, (state, { userId }) => state.filter(u => u.id !== userId))
);
