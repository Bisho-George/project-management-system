import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-dialog',
  templateUrl: './add-edit-dialog.component.html',
  styleUrls: ['./add-edit-dialog.component.scss']
})
export class AddEditDialogComponent implements OnInit {
  isViewMode = false;
  form: FormGroup;

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
        value: field.value || '',
        disabled: this.isViewMode
      }, field.validators || []);
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
