import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from 'src/app/shared/components/home/home.component';
import { employeeGuard } from 'src/app/core/guards/employee.guard';
import { managerGuard } from 'src/app/core/guards/manager.guard';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: 'manager', pathMatch: 'full' },
      { path: 'home',canActivate: [authGuard], component: HomeComponent },
      { path: 'employee', canActivate: [employeeGuard], loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'manager', canActivate: [managerGuard], loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule) }
    ]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
