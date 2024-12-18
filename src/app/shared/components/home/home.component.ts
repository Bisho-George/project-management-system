import { Component } from '@angular/core';
import { HomeService } from '../../services/home.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private _HomeService: HomeService) { }
  ngOnInit(): void {
    this.getUsersCount()
    this.getTasksData()
  }
  chart: any;
  usersCount: any;
  tasksData: any;
  userName = localStorage.getItem('userName')
  projectsCount = localStorage.getItem('projectsCount')
  tasksCount = localStorage.getItem('tasksCount')
  getUsersCount() {
    this._HomeService.getUsresCount().subscribe({
      next: (res) => {
        this.usersCount = res

      }, error: (err) => {

      }, complete: () => { }
    })
  }
  getTasksData() {
    this._HomeService.getTasksData().subscribe({
      next: (res) => {
        this.tasksData = res;
      }, error: (err) => {

      }, complete: () => {
        this.chart = new Chart('canvas', {
          type: 'doughnut',
          data: {
            labels: [
              'To Do',
              'In Progress',
              'Done'
            ],
            datasets: [{
              label: 'My First Dataset',
              data: [this.tasksData?.toDo, this.tasksData?.inProgress, this.tasksData?.done],
              backgroundColor: [
                'rgb(14,56,47)',
                'rgb(239,155,40)',
                'rgb(100,65,23)'
              ],
              hoverOffset: 4
            }]
          }
        })
      }
    })
  }
}
