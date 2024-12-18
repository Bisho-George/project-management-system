import { Component } from '@angular/core';
import { TasksService } from './services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import { AddEditDialogComponent } from 'src/app/shared/components/add-edit-dialog/add-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item/delete-item.component';
import { UsersService } from '../users/services/users.service';
import { ITask } from './interfaces/task.interface';
import { ProjectsService } from '../projects/services/projects.service';
import { IDataResponse } from 'src/app/shared/interface/data-response.interface';
import { IProject } from '../projects/interfaces/project.interface';
import { IUser } from '../users/interfaces/user.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tableData!: any;
  resData: any;
  userData: any;
  projectData: any;
  statusValue: string = '';
  searchValue = '';
  status: string[] = ['ToDo', 'InProgress', 'Done'];
  constructor(private dialog: MatDialog, private _ProjectsService: ProjectsService, private _UsersService: UsersService, private _TasksService: TasksService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getTasks();
    this.getUsers()
    this.getProjects()
  }

  getTasks() {
    let myParams = {
      title: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
      status: this.statusValue
    };
    this._TasksService.getTasks(myParams).subscribe({
      next: (res: any) => {
        this.passDataToTable(res);
        this.resData = res.data
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
      next: (res: any) => {
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
    this._ProjectsService.getProjects(myParams).subscribe({
      next: (res: IDataResponse<IProject>) => {
        this.projectData = res.data
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }

  private openAddDialog(title?: string, description?: string,  readOnly = false) {
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
  }  private openAddEditDialog(title?: string, description?: string, employee?: IUser, readOnly = false) {
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
        this._TasksService.addTask(result).subscribe({
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
  passDataToTable(res: any) {
    if (!res.data || res.data.length === 0) {
      this.tableData = { ...this.tableData, data: { ...this.tableData?.data, data: [] } };
      return;
    }
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
      actions: [
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
          callback: (row: ITask) => this.editTask(row.id),
        },
        {
          type: 'button',
          color: 'warn',
          label: 'Delete',
          icon: 'delete',
          callback: (row: any) => this.openDeleteDialog(row),
        },
      ],
    };

    // Trigger change detection explicitly if needed
    this.tableData = { ...this.tableData };
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  onPageChange(event: { pageNumber: number, pageSize: number }): void {
    this.tableData.data.pageNumber = event.pageNumber;
    this.tableData.data.pageSize = event.pageSize;
    this.getTasks();
  }
  clearFilter(): void {
    this.searchValue = '';
    this.getTasks();
  }
  viewTask(task: ITask, user: IUser): void {
    this.openAddEditDialog(task.title, task.description, user, true).subscribe((result) => {
      if (result) {
        // this._TasksService.updateTask(task.id, result).subscribe({
        //   next: () => { },
        //   error: (err) => {
        //     this.toast.error(err.error.message);
        //   }, complete: () => {
        //     this.toast.success('Task updated successfully');
        //     this.getTasks();
        //   }
        // })
      }
    });
  }
  editTask(id: number): void {
    this.openAddEditDialog
  }
  // deleteTask(id: number): void {
  //   const dialogRef = this.dialog.open(
  //     DeleteItemComponent, {
  //       data: { text:'Task'}
  //   })
  //   dialogRef.afterClosed().subscribe(() => {
  //     this._TasksService.deleteTask(id).subscribe({
  //       next: () => {
  //       },
  //       error: (err) => {
  //         this.toast.error(err.error.message);
  //       },
  //       complete: () => {
  //         this.toast.success('Task deleted')
  //         this.getTasks();
  //       }
  //     })
  //   })
  // }
  openDeleteDialog(item: ITask): void {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      data: { text: 'Task', id: item.id ,type:'delete',image:'assets/images/deleteImg.png',widthImage:'width: 140px;'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteUser(result)
      }
    });
  }
  onDeleteUser(id: number) {
    this._TasksService.deleteTask(id).subscribe({
      next: (res) => {
        this.toast.success('Task is deleted')
      },
      error(err) {
      },
      complete: () => {
        this.getTasks();
      }
    })
  }
}
