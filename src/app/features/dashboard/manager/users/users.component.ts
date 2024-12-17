import { Component } from '@angular/core';
import { UsersService } from './services/users.service';
import { ToastrService } from 'ngx-toastr';
 

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  tableData!: any;
  resTable:any;
  searchValue = '';
  roleId:number[]=[1,2];
  constructor(private _UsersService: UsersService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    let myParams = {
      userName: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
      groups:this.roleId,
    };
    this._UsersService.getUsers(myParams).subscribe({
      next: (res: any) => {
        this.passDataToTable(res);
        this.resTable = res
       },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }
  passDataToTable(res: any) {
    if (!res.data || res.data.length === 0) {
      this.tableData = { ...this.tableData, data: { ...this.tableData?.data, data: [] } };
      return;
    }
    const excludedFields = ['id'];
    const sampleUser = res.data[0];

    this.tableData = {
      data: res,
      columns: Object.keys(sampleUser)
        .filter((key) => !excludedFields.includes(key))
        .map((key) => ({
          field: key,
          header: this.formatHeader(key),
        })),
      actions: [
        {
          type: 'button',
          label: 'View',
          color:'accent',
          icon: 'visibility',
          callback: (row: any) => console.log('view', row),
        },
        {
          type: 'button',
          label: 'Block',
          icon: 'block',
          callback: (row: any) => console.log('Block', row),
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
    this.getUsers();
  }
  clearFilter(): void {
    this.searchValue = '';
    this.getUsers();
  }


}
