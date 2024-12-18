import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { IUserTask } from '../interfaces/user-task.interface';
import { IUserTasksParams } from '../interfaces/user-tasks-params.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _http: HttpClient) { }
  getEmployeeTasks(params: IUserTasksParams): Observable<IDataResponse<IUserTask>> {
    return this._http.get<IDataResponse<IUserTask>>('Task', {
      params: {
        title: params?.title || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
        status: params?.status || ''
      }
    });
  }
  updateTaskStatus (id: number, status: string) {
    return this._http.put(`Task/${id}/change-status`, {
      status
    })
  }
}
