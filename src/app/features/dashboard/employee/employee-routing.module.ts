import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';

const routes: Routes = [{ path: '', redirectTo: 'projects', pathMatch: 'full' }, { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
