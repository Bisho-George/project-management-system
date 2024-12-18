import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { IUserTask } from './interfaces/user-task.interface';
import { TasksService } from './services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  todo: IUserTask[] = [];
  inProgress: IUserTask[] = [];
  done: IUserTask[] = [];

  constructor(private userTasksService: TasksService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getUserTasks();
  }

  drop(event: CdkDragDrop<IUserTask[]>, targetContainer: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateTaskStatus(task, targetContainer);
    }
  }
  getUserTasks() {
    let params = {
      pageNumber: 1,
      pageSize: 9000,
    }
    this.userTasksService.getEmployeeTasks(params).subscribe({
      next: (res: IDataResponse<IUserTask>) => {
        this.filterTasks(res.data);
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }

  private filterTasks(data: IUserTask[]) {
    data.forEach((task) => {
      if (task.status === 'ToDo') {
        this.todo.push(task);
      } else if (task.status === 'InProgress') {
        this.inProgress.push(task);
      } else {
        this.done.push(task);
      }
    });
  }
  updateTaskStatus(task: IUserTask, status: string) {
    this.userTasksService.updateTaskStatus(task.id, status).subscribe({
      next: (res) => {},
      error: (err) => {
      },
    });
  }
  getContainerName(containerId: string): string {
    switch (containerId) {
      case 'todoList': return 'ToDo';
      case 'inProgressList': return 'InProgress';
      case 'doneList': return 'Done';
      default: return 'Unknown';
    }
  }
}
