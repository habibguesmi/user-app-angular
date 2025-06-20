import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://userapi-5rvm.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<User> {
    const userDTO = {
      name: user.nom,
      username: user.pseudo,
      status: user.statut,
      budget: user.budget,
    };
    return this.http.post<User>(this.apiUrl, userDTO);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
  updateUser(user: User) {
    const userDTO = {
      name: user.nom,
      username: user.pseudo,
      status: user.statut,
      budget: user.budget,
    };
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, userDTO);
    
  }
  
}
