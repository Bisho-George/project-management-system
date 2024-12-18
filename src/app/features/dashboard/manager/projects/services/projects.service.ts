import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { IProject } from '../interfaces/project.interface';
import { IProjectParams } from '../interfaces/projects-params.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private _http: HttpClient) { }

  getProjects(params?: IProjectParams): Observable<IDataResponse<IProject>> {
    return this._http.get<IDataResponse<IProject>>('Project/manager', {
      params: {
        title: params?.title || '',
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 5,
      }
    });
  }
  addProject (project: FormGroup) {
    return this._http.post('Project', project);
  }
  updateProject (id: number, project: FormGroup) {
    return this._http.put(`Project/${id}`, project)
  }
  deleteProject (id: number) {
    return this._http.delete(`Project/${id}`);
  }
}
