import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { IUser } from '../interfaces/user.interface';
import { IUsersParams } from '../interfaces/users-params';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

 constructor(private _http: HttpClient) { }

  getUsers(params?: IUsersParams): Observable<IDataResponse<IUser>> {
    return this._http.get<IDataResponse<IUser>>('Users/', {
      params: {
        userName: params?.userName || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
        groups:params?.groups||2,
      }
    });
  }
  onActivateUser(id: number): Observable<IDataResponse<IUser>> {
    return this._http.put<IDataResponse<IUser>>(`Users/${id}`, {});
  }
}
