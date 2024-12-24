import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { ITableAction, ITableData } from 'src/app/shared/interface/table/table-data.interface';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './services/users.service';
import { ViewUserProfileComponent } from 'src/app/shared/components/view-user-profile/view-user-profile.component';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item/delete-item.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableTypeEnum } from 'src/app/shared/enums/table-type-enum';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  tableType: TableTypeEnum = TableTypeEnum.Users;
  baseUrl = 'https://upskilling-egypt.com:3003/';
  resTable: IDataResponse<IUser> | undefined;
  searchValue = '';
  roleId: number[] = [1, 2];
  actions: ITableAction[] = [];
  tableData: ITableData = {
    data: { data: [], pageNumber: 1, pageSize: 5, totalNumberOfRecords: 0, totalNumberOfPages: 0 },
    columns: [],
    actions: this.actions,
  };

  constructor(private dialog: MatDialog, private _UsersService: UsersService, private toast: ToastrService) {
    this.actions = [
      {
        type: 'button',
        label: 'View',
        color: 'accent',
        icon: 'visibility',
        callback: (row: IUser) => this.openViewDialog(row),
      },
      {
        type: 'button',
        label: 'Block',
        icon: 'block',
        callback: (row: IUser) => this.openBlockDialog(row),
      },
    ]
    this.tableData = {
      data: { data: [], pageNumber: 1, pageSize: 5, totalNumberOfRecords: 0, totalNumberOfPages: 0 },
      columns: [],
      actions: this.actions
    };
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    const userParams = {
      userName: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
      groups: this.roleId,
    };
    this._UsersService.getUsers(userParams).subscribe({
      next: (res: IDataResponse<IUser>) => {
        res.data.forEach((user) => {
          if (user.imagePath !== null) {
            user.imagePath = this.baseUrl + user.imagePath;
          }
        });
        this.passDataToTable(res);
        this.resTable = res;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }

  passDataToTable(res: IDataResponse<IUser>): void {
    if (!res.data || res.data.length === 0) {
      this.tableData = {
        ...this.tableData,
        data: { ...this.tableData.data, data: [] },
      };
      return;
    }
    const excludedFields = ['id', 'creationDate', 'modificationDate'];
    const sampleUser = res.data[0];
    this.tableData = {
      data: res,
      columns: Object.keys(sampleUser)
        .filter((key) => !excludedFields.includes(key))
        .map((key) => ({
          field: key,
          header: this.formatHeader(key),
        })),
      actions: this.actions,
    };
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  onPageChange(event: { pageNumber: number, pageSize: number }): void {
    this.tableData.data.pageNumber = event.pageNumber;
    this.tableData.data.pageSize = event.pageSize;
    this.getUsers();
  }
  clearFilter(): void {
    this.searchValue = '';
    this.getUsers();
  }
  handlePageChange(event: { pageNumber: number, pageSize: number }) {
    this.tableData.data.pageNumber = event.pageNumber;
    this.tableData.data.pageSize = event.pageSize;
    this.getUsers();
  }

  openViewDialog(item: IUser): void {
    const dialogRef = this.dialog.open(ViewUserProfileComponent, {
      width: '45%',
      data: { item },
    });
    dialogRef.afterClosed().subscribe();
  }

  openBlockDialog(item: IUser): void {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      data: { text: 'User', id: item.id, type: item.isActivated ? 'Block ' : 'Unblock ', data: item, image: 'assets/images/png/block-dialog-picture.png', widthImage: 'width: 100px; margin-bottom:20px;' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._UsersService.onActivateUser(result).subscribe({
          next: (res) => { },
          error: (err) => {
            this.toast.error(err.error.message, 'error')
          }, complete: () => {
            this.getUsers()
            this.toast.success('Activity updated successfully');
          }
        })
      }
    });
  }
}
