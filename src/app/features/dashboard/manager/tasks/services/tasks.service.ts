import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IAddTask } from '../interfaces/add-task.interface';
import { IEditTask } from '../interfaces/edit-task.interface';
import { ITaskParams } from '../interfaces/task-params';
import { ITask } from '../interfaces/task.interface';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _http: HttpClient) { }

  getTasks(params?: ITaskParams): Observable<IDataResponse<ITask>> {
    return this._http.get<IDataResponse<ITask>>('Task/manager', {
      params: {
        title: params?.title || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
        status: params?.status || 'ToDo'
      }
    });
  }
  addTask(task: IAddTask) {
    return this._http.post('Task', task);
  }
  updateTask(id: number, task: IEditTask) {
    return this._http.put(`Task/${id}`, task);
  }
  deleteTask(id: number) {
    return this._http.delete(`Task/${id}`);
  }

}
