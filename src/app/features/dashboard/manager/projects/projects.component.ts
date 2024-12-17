import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddEditDialogComponent } from 'src/app/shared/components/add-edit-dialog/add-edit-dialog.component';
import { IDataResponse } from 'src/app/shared/interface/data-response.interface';
import { ITableData } from 'src/app/shared/interface/table-data.interface';
import { IProject } from './interfaces/project.interface';
import { ProjectsService } from './services/projects.service';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item/delete-item.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  tableData!: ITableData;
  searchValue = '';

  constructor(private dialog: MatDialog, private projectsService: ProjectsService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getProjects();
  }
  passDataToTable(res: IDataResponse<IProject>) {
    if (!res.data || res.data.length === 0) {
      this.tableData = { ...this.tableData, data: { ...this.tableData?.data, data: [] } };
      return;
    }

    const excludedFields = ['id'];
    const sampleProject = res.data[0];
    console.log (res);
    this.tableData = {
      data: res,
      columns: Object.keys(sampleProject)
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
          callback: (row: IProject) => this.viewProject(row),
        },
        {
          type: 'button',
          label: 'Edit',
          color: 'accent',
          icon: 'edit_square',
          callback: (row: IProject) => this.editProject(row),
        },
        {
          type: 'button',
          color: 'warn',
          label: 'Delete',
          icon: 'delete',
          callback: (row: IProject) => this.deleteProject(row.id),
        },
      ],
    };
    // Trigger change detection explicitly if needed
    this.tableData = { ...this.tableData };
  }

  getProjects() {
    console.log(this.tableData);
    let myParams = {
      title: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
    };
    this.projectsService.getProjects(myParams).subscribe({
      next: (res: IDataResponse<IProject>) => {
        this.passDataToTable(res);
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  onPageChange(event: { pageNumber: number, pageSize: number }): void {
    this.tableData.data.pageNumber = event.pageNumber;
    this.tableData.data.pageSize = event.pageSize;
    this.getProjects();
  }
  clearFilter(): void {
    this.searchValue = '';
    this.getProjects();
  }
  private openAddEditDialog(title?: string, description?: string, readOnly = false) {
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      width: '40%',
      data: {
        fields: [
          { type: 'text', label: 'Title', name: 'title', value: title || '', validators: [Validators.required] },
          { type: 'description', label: 'Description', name: 'description', value: description || '', validators: [Validators.required] },
        ],
        readOnly
      }
    })
    return dialogRef.afterClosed();
  }
  private openDeleteDialog(id:number) {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      width: '40%',
      data: { text:'projectyy'}
    })
    return dialogRef.afterClosed();
  }
  addProject() {
    this.openAddEditDialog().subscribe((result) => {
      if (result) {
        this.projectsService.addProject(result).subscribe({
          next: () => { },
          error: (err) => {
            this.toast.error(err.error.message);
          }, complete: () => {
            this.toast.success('Project added successfully');
            this.getProjects();
          }
        })
      }
    })
  }

  editProject(project: IProject): void {
    this.openAddEditDialog(project.title, project.description).subscribe((result) => {
      if (result) {
        this.projectsService.updateProject(project.id, result).subscribe({
          next: () => {},
          error: (err) => {
            this.toast.error(err.error.message);
          },
          complete: () => {
            this.toast.success('Project updated successfully')
            this.getProjects();
          }
        })
      }
    });
  }

  viewProject(project: IProject): void {
    this.openAddEditDialog(project.title, project.description, true).subscribe(() => {});
  }
  deleteProject(id: number): void {
    this.openDeleteDialog(id).subscribe((result) => {
      if (result) {
        this.projectsService.deleteProject(id).subscribe({
          next: () => {},
          error: (err) => {
            this.toast.error(err.error.message);
          },
          complete: () => {
            this.toast.success('Project deleted')
            this.getProjects();
          }
        })
      }
    });
  }

}
