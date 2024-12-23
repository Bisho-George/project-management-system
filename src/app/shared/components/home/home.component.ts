import { Component } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { IHomeRole } from '../../interface/home/home-role.interface';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  chart: any;
  tasksData: any;
  usersCount: IHomeRole | null = null;
  userName: string | null = '';
  projectsCount = 0;
  role: string | null = '';
  tasksCount = 0;
  constructor(private _HomeService: HomeService) {}
  ngOnInit(): void {
    this.getUsersCount();
    this.getTasksData();
    this.getDataFromLocalStorage();
    this.getTasks();
    this.getProjects();
  }
  getDataFromLocalStorage() {
    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    }
    if (localStorage.getItem('userGroup')) {
      this.role = localStorage.getItem('userGroup');
    }
  }
  getUsersCount() {
    this._HomeService.getUsresCount().subscribe({
      next: (res: IHomeRole) => {
        this.usersCount = res;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
  getTasks() {
    this._HomeService.getTasksData().subscribe({
      next: (res) => {
        this.tasksCount = res.totalNumberOfRecords;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
  getTasksData() {
    this._HomeService.getTasksCount().subscribe({
      next: (res) => {
        this.tasksData = res;
      },
      error: (err) => {},
      complete: () => {
        this.chart = new Chart('canvas', {
          type: 'doughnut',
          data: {
            labels: ['To Do', 'In Progress', 'Done'],
            datasets: [
              {
                label: 'My First Dataset',
                data: [
                  this.tasksData?.toDo,
                  this.tasksData?.inProgress,
                  this.tasksData?.done,
                ],
                backgroundColor: [
                  'rgb(14,56,47)',
                  'rgb(239,155,40)',
                  'rgb(100,65,23)',
                ],
                hoverOffset: 4,
              },
            ],
          },
        });
      },
    });
  }
  getProjects() {
    this._HomeService.getProjects().subscribe({
      next: (res) => {
        this.projectsCount = res.totalNumberOfRecords;
      },
      error: (err) => {},
    });
  }
}
