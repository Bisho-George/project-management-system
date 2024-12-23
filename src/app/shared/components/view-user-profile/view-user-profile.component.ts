import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/features/dashboard/manager/users/interfaces/user.interface';
import { UsersService } from 'src/app/features/dashboard/manager/users/services/users.service';
import { IDataResponse } from '../../interface/api-data-response/data-response.interface';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss'],
})
export class ViewUserProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewUserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
