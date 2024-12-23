import { Component, EventEmitter, HostListener, Output } from '@angular/core';
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
  @Output() isOpenedValue = new EventEmitter<boolean>();
  isOpened:boolean =true;
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
    {link:'/dashboard/employee/projects',icon:'fa-table-list',text:'Projects',isActive:this.isEmployee()},
    {link:'/dashboard/employee/tasks',icon:'fa-list-check',text:'Tasks',isActive:this.isEmployee()},
  ];
  onClicked() {
    this.isOpened = !this.isOpened;
    this.isOpenedValue.emit(this.isOpened);
  }
}
