import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserProfile } from '../interface/user-profile/user-profile-interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  user = new BehaviorSubject<IUserProfile | null>(null);

  constructor(private _http: HttpClient) {
    this.loadCurrentUser();
  }

  getCurrentUser(): Observable<IUserProfile> {
    return this._http.get<IUserProfile>('Users/currentUser');
  }
  updateUserProfile(data: FormData): Observable<IUserProfile> {
    return this._http.put<IUserProfile>('Users', data);
  }
  loadCurrentUser() {
    this.getCurrentUser().subscribe((user) => {
      this.user.next(user);
    });
  }
}
