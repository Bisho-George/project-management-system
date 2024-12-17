import { Component } from '@angular/core';
import { TasksService } from './services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import { AddEditDialogComponent } from 'src/app/shared/components/add-edit-dialog/add-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item/delete-item.component';
import { UsersService } from '../users/services/users.service';
import { ITask } from './interfaces/task.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tableData!: any;
  resData: any;
  userData: any;
  statusValue: string = '';
  searchValue = '';
  status: string[] = ['ToDo', 'InProgress', 'Done'];
  constructor(private dialog: MatDialog, private _UsersService: UsersService, private _TasksService: TasksService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getTasks();
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
  private openAddEditDialog(title?: string, description?: string, readOnly = false) {
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      width: '40%',
      data: {
        fields: [
          { type: 'text', label: 'Title', name: 'title', value: title || '', validators: [Validators.required] },
          { type: 'description', label: 'Description', name: 'description', value: description || '', validators: [Validators.required] },
          { type: 'select', label: 'User', name: 'user', value: this.userData || '', validators: [Validators.required] },
        ],
        readOnly
      }
    })
    return dialogRef.afterClosed();
  }
  addTask() {
    this.openAddEditDialog().subscribe((result) => {
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
          callback: (row: any) => this.viewTask(row.id),
        },
        {
          type: 'button',
          label: 'Edit',
          color: 'accent',
          icon: 'edit_square',
          callback: (row: any) => this.editTask(row),
        },
        {
          type: 'button',
          color: 'warn',
          label: 'Delete',
          icon: 'delete',
          callback: (row: ITask) => this.deleteTask(row.id),
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
  viewTask(id: number): void {
    console.log('Edit Task:', id);
  }
  editTask(id: number): void {
    console.log('Edit Task:', id);
  }
  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(
      DeleteItemComponent, {
      data: 'Delete Task'
    })
    dialogRef.afterClosed().subscribe(() => {
      this._TasksService.deleteTask(id).subscribe({
        next: () => {
        },
        error: (err) => {
          this.toast.error(err.error.message);
        },
        complete: () => {
          this.toast.success('Task deleted')
          this.getTasks();
        }
      })
    })
  }
}
