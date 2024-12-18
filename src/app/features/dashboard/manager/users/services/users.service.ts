import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsersParams } from '../interfaces/users-params';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

 constructor(private _http: HttpClient) { }

  getUsers(params?: IUsersParams): Observable<any> {
    return this._http.get('Users/', {
      params: {
        userName: params?.userName || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
        groups:params?.groups||2,
      }
    });
  }
  onActivateUser(id: number): Observable<any> {
    return this._http.put(`Users/${id}`, {});
  }
}
