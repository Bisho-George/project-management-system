import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser } from 'src/app/features/dashboard/manager/users/interfaces/user.interface';

@Component({
  selector: 'app-add-edit-dialog',
  templateUrl: './add-edit-dialog.component.html',
  styleUrls: ['./add-edit-dialog.component.scss']
})
export class AddEditDialogComponent implements OnInit {
  isViewMode = false;
  form: FormGroup;
  employee: IUser | undefined;

  constructor(
    public dialogRef: MatDialogRef<AddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.isViewMode = data.readOnly;
    this.form = this.createForm(data.fields);
  }
  ngOnInit(): void {
    if (this.isViewMode) {
      this.disableAllFields();
    }
  }

  private disableAllFields(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].disable();
    });
  }

  private createForm(fields: any[]): FormGroup {
    const group: any = {};
    fields.forEach((field) => {
      group[field.name] = this.fb.control({
      value: field.name === 'user' && field.employee ? field.employee.id : field.value || '',
        disabled: this.isViewMode
      }, field.validators || []);
      this.employee = field.employee;
    });

    return this.fb.group(group);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }
}
