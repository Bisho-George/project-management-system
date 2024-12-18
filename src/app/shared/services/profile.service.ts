import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfile } from '../interface/user-profile/user-profile-interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  getCurrentUser(): Observable<IUserProfile>{
    return this._http.get<IUserProfile>('Users/currentUser');
  }
}
