import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

constructor(private _HttpClient:HttpClient) { }
getTasksCount():Observable<any>
  {
    return this._HttpClient.get('Task/count')
  }
  getUsresCount():Observable<any>
  {
    return this._HttpClient.get('Users/count')
  }
  getTasksData():Observable<any>
  {
    return this._HttpClient.get('Task/count')
  }
}
