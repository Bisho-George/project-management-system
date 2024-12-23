import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHomeRole } from '../interface/home/home-role.interface';
import { IDataResponse } from '../interface/api-data-response/data-response.interface';
import { IProject } from 'src/app/features/dashboard/employee/projects/interfaces/project.interface';
import { ITask } from 'src/app/features/dashboard/manager/tasks/interfaces/task.interface';

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
  getTasksData():Observable<IDataResponse<ITask>>
  {
    return this._HttpClient.get<IDataResponse<ITask>>('Task/Manager')
  }
   getProjects(): Observable<IDataResponse<IProject>> {
      return this._HttpClient.get<IDataResponse<IProject>>('Project/manager' )
    }
}
