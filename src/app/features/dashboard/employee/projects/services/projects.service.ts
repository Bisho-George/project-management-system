import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataResponse } from 'src/app/shared/interface/data-response.interface';
import { IProject } from '../interfaces/project.interface';
import { IProjectParams } from '../../../manager/projects/interfaces/projects-params.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private _http: HttpClient) { }

  getProjects(params:IProjectParams): Observable<IDataResponse<IProject>> {
    return this._http.get<IDataResponse<IProject>>('Project/employee');
  }
}
