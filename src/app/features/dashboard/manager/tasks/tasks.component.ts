import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/features/dashboard/manager/users/interfaces/user.interface';
import { AddEditDialogComponent } from 'src/app/shared/components/add-edit-dialog/add-edit-dialog.component';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item/delete-item.component';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { ITableAction, ITableData } from 'src/app/shared/interface/table/table-data.interface';
import { IProject } from '../projects/interfaces/project.interface';
import { ProjectsService } from '../projects/services/projects.service';
import { UsersService } from '../users/services/users.service';
import { ITask } from './interfaces/task.interface';
import { TasksService } from './services/tasks.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableTypeEnum } from 'src/app/shared/enums/table-type-enum';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tableType = TableTypeEnum.Tasks;
  tableData: ITableData;
  resData: IDataResponse<ITask> | undefined;
  userData: IUser[] | undefined;
  projectData: IProject[] = [];
  statusValue = '';
  searchValue = '';
  status = ['ToDo', 'InProgress', 'Done'];
  actions: ITableAction[] = [];
  constructor(private dialog: MatDialog, private _projectsService: ProjectsService, private _UsersService: UsersService, private _tasksService: TasksService, private toast: ToastrService) {
    this.actions = [
      {
        type: 'button',
        label: 'View',
        color: 'accent',
        icon: 'visibility',
        callback: (row: ITask) => this.viewTask(row, row.employee),
      },
      {
        type: 'button',
        label: 'Edit',
        color: 'accent',
        icon: 'edit_square',
        callback: (row: ITask) => this.editTask(row, row.employee),
      },
      {
        type: 'button',
        color: 'warn',
        label: 'Delete',
        icon: 'delete',
        callback: (row: ITask) => this.openDeleteDialog(row),
      },
    ],
      this.tableData = {
        data: { data: [], pageNumber: 1, pageSize: 5, totalNumberOfRecords: 0, totalNumberOfPages: 0 },
        columns: [],
        actions: this.actions
      }
  }

  ngOnInit(): void {
    this.getTasks();
    this.getUsers()
    this.getProjects()
  }

  getTasks() {
    let taskParams = {
      title: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
      status: this.statusValue
    };
    this._tasksService.getTasks(taskParams).subscribe({
      next: (res: IDataResponse<ITask>) => {
        this.passDataToTable(res);
        this.resData = res
        localStorage.setItem('tasksCount', JSON.stringify(res.totalNumberOfRecords))
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }
  getUsers() {
    let myParams = {
      pageNumber: 1,
      pageSize: 9999,
    };
    this._UsersService.getUsers(myParams).subscribe({
      next: (res: IDataResponse<IUser>) => {
        this.userData = res.data
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }
  getProjects() {
    let myParams = {
      pageNumber: 1,
      pageSize: 9999,
    };
    this._projectsService.getProjects(myParams).subscribe({
      next: (res: IDataResponse<IProject>) => {
        this.projectData = res.data
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }

  private openAddDialog(title?: string, description?: string, readOnly = false) {
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      width: '40%',
      data: {
        fields: [
          { type: 'text', label: 'Title', name: 'title', value: title || '', validators: [Validators.required] },
          { type: 'description', label: 'Description', name: 'description', value: description || '', validators: [Validators.required] },
          { type: 'select', label: 'User', name: 'user', value: this.userData, validators: [Validators.required] },
          { type: 'select', label: 'Project', name: 'project', value: this.projectData, validators: [Validators.required] },
        ],
        readOnly
      }
    })
    return dialogRef.afterClosed();
  } private openAddEditDialog(title?: string, description?: string, employee?: IUser, readOnly = false) {
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      width: '40%',
      data: {
        fields: [
          { type: 'text', label: 'Title', name: 'title', value: title || '', validators: [Validators.required] },
          { type: 'description', label: 'Description', name: 'description', value: description || '', validators: [Validators.required] },
          { type: 'select', label: 'User', name: 'user', value: this.userData, employee, validators: [Validators.required] },
        ],
        readOnly
      }
    })
    return dialogRef.afterClosed();
  }
  addTask() {
    this.openAddDialog().subscribe((result) => {
      if (result) {
        this._tasksService.addTask({
          title: result.title,
          description: result.description,
          employeeId: result.user,
          projectId: result.project
        }).subscribe({
          next: () => { },
          error: (err) => {
            this.toast.error(err.error.message);
          }, complete: () => {
            this.toast.success('Task added successfully');
            this.getTasks();
          }
        })
      }
    })
  }
  passDataToTable(res: IDataResponse<ITask>) {
    if (!res.data || res.data.length === 0) {
      this.tableData = { ...this.tableData, data: { ...this.tableData?.data, data: [] } };
      return;
    }
    console.log(res);
    const excludedFields = ['id'];
    const sampleTask = res.data[0];
    this.tableData = {
      data: res,
      columns: Object.keys(sampleTask)
        .filter((key) => !excludedFields.includes(key))
        .map((key) => ({
          field: key,
          header: this.formatHeader(key),
        })),
      actions: this.actions
    };
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  clearFilter(): void {
    this.searchValue = '';
    this.getTasks();
  }
  viewTask(task: ITask, user: IUser): void {
    this.openAddEditDialog(task.title, task.description, user, true).subscribe((result) => { });
  }
  editTask(task: ITask, user: IUser): void {
    this.openAddEditDialog(task.title, task.description, user).subscribe((result) => {
      if (result) {
        this._tasksService.updateTask(task.id, {
          title: result.title,
          description: result.description,
          employeeId: result.user
        }).subscribe(({
          next: () => { },
          error: (error) => this.toast.error(error.error.message),
          complete: () => {
            this.toast.success('Task updated successfully');
            this.getTasks();
          }
        }))
      }
    })
  }

  openDeleteDialog(item: ITask): void {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      data: { text: 'Task', id: item.id ,type:'delete',image:'assets/images/png/delete-dialog-picture.png',widthImage:'width: 140px;'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask(result)
      }
    });
  }
  private deleteTask(id: number) {
    this._tasksService.deleteTask(id).subscribe({
      next: () => { },
      error: (err) => {
        this.toast.error(err.error.message);
      }, complete: () => {
        this.toast.success('Task deleted successfully');
        this.getTasks();
      }
    })
  }
  handlePageChange(event: { pageNumber: number; pageSize: number }): void {
    this.tableData.data.pageNumber = event.pageNumber;
    this.tableData.data.pageSize = event.pageSize;
    this.getTasks();
  }

}
