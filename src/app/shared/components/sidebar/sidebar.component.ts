import { Component } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
interface Imenu{
  link:string;
  icon:string;
  text:string;
  isActive:boolean;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private _AuthService:AuthService){}
  isManager(){
    return this._AuthService.role === 'Manager' ? true : false
  }
  isEmployee(){
    return this._AuthService.role === 'Employee' ? true : false
  }
  menu:Imenu[]=[
    {link:'/dashboard/home',icon:'fa-home',text:'Home',isActive:this.isManager()||this.isEmployee()},
    {link:'/dashboard/manager/users',icon:'fa-user-group',text:'Users',isActive:this.isManager()},
    {link:'/dashboard/manager/tasks',icon:'fa-list',text:'Tasks',isActive:this.isManager()},
    {link:'/dashboard/manager/projects',icon:'fa-table-list',text:'Projects',isActive:this.isManager()},
    {link:'/dashboard/employee/employee-projects',icon:'fa-list',text:'Projects',isActive:this.isEmployee()},
    {link:'/dashboard/employee/employee-tasks',icon:'fa-heart',text:'Tasks',isActive:this.isEmployee()},
  ];

}
