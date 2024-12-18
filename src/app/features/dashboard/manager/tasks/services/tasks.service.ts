import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ITaskParams } from '../interfaces/task-params';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _http: HttpClient) { }

  getTasks(params?: ITaskParams): Observable<any> {
    return this._http.get('Task/manager', {
      params: {
        title: params?.title || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
        status: params?.status || 'ToDo'
      }
    });
  }
  addTask(task: FormGroup) {
    return this._http.post('Task', task);
  }
  deleteTask(id: number) {
    return this._http.delete(`Task/${id}`);
  }

}
