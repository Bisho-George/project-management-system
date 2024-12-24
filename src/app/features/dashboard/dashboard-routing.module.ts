import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth/auth.guard';
import { employeeGuard } from 'src/app/core/guards/employee/employee.guard';
import { managerGuard } from 'src/app/core/guards/manager/manager.guard';
import { HomeComponent } from 'src/app/shared/components/home/home.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', canActivate: [authGuard], component: HomeComponent },
      { path: 'employee', canActivate: [employeeGuard], loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'manager', canActivate: [managerGuard], loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule) },
      { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
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
