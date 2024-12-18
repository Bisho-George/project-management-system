import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHomeRole } from '../interface/home/home-role.interface';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

constructor(private _HttpClient:HttpClient) { }
getTasksCount():Observable<any>
  {
    return this._HttpClient.get('Task/count')
  }
  getUsresCount():Observable<IHomeRole>
  {
    return this._HttpClient.get<IHomeRole>('Users/count')
  }
  getTasksData():Observable<any>
  {
    return this._HttpClient.get('Task/Manager')
  }
   getProjects(): Observable<any> {
      return this._HttpClient.get('Project/manager' )
    }
}
