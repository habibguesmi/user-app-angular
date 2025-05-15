import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../models/user.model';

export const selectUsers = createFeatureSelector<User[]>('users');

export const selectAllUsers = createSelector(
  selectUsers,
  users => users
);
