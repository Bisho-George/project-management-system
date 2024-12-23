import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddEditDialogComponent } from 'src/app/shared/components/add-edit-dialog/add-edit-dialog.component';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item/delete-item.component';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { ITableData } from 'src/app/shared/interface/table/table-data.interface';
import { IProject } from './interfaces/project.interface';
import { ProjectsService } from './services/projects.service';
import { TableTypeEnum } from 'src/app/shared/enums/table-type-enum';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  tableType = TableTypeEnum.Projects;
  tableData: ITableData;
  searchValue = '';
  pageNumber = 1
  pageSize = 5;
  totalNumberOfRecords = 0;

  constructor(private dialog: MatDialog, private projectsService: ProjectsService, private toast: ToastrService) {
    this.tableData = {
      data: { data: [], pageNumber: 1, pageSize: 5, totalNumberOfRecords: 0, totalNumberOfPages: 0 },
      columns: [],
      actions: []
    };
  }

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
          callback: (row: IProject) => this.openDeleteDialog(row),
        },
      ],
    };
  }

  getProjects() {
    let projectParams = {
      title: this.searchValue,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    this.projectsService.getProjects(projectParams).subscribe({
      next: (res: IDataResponse<IProject>) => {
        this.passDataToTable(res);
        localStorage.setItem('projectsCount', JSON.stringify(res.totalNumberOfRecords))
        this.pageNumber = res.pageNumber;
        this.pageSize = res.pageSize;
        this.totalNumberOfRecords = res.totalNumberOfRecords;
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
          next: () => { },
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
    this.openAddEditDialog(project.title, project.description, true).subscribe(() => { });
  }

  openDeleteDialog(project: IProject): void {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      data: { text: 'Project', id: project.id, type: 'delete', image: 'assets/images/png/delete-dialog-picture.png', widthImage: 'width: 140px;' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteUser(result)
      }
    });
  }

  onDeleteUser(id: number) {
    this.projectsService.deleteProject(id).subscribe({
      next: (res) => {
        this.toast.success('Project is deleted')
      },
      error(err) {
      },
      complete: () => {
        this.getProjects();
      }
    })
  }

  handlePageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.getProjects();
  }
}
