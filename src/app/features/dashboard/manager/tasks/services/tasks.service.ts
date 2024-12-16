import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

constructor(private _http: HttpClient) { }

  getTasks(params?: any): Observable<any> {
    return this._http.get('Task/manager', {
      params: {
        title: params?.title || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
      }
    });
  }
}
