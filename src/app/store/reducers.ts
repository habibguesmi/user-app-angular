import { ActionReducerMap } from '@ngrx/store';
import { userReducer } from '../store/user.reducer';
import { User } from '../models/user.model';

// Définis la structure globale du store
export interface AppState {
  user: User[];
}

// Map des reducers
export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
};
