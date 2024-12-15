import { ITableData } from 'src/app/shared/interface/table-data.interface';
import { ProjectsService } from './services/projects.service';
import { Component, OnInit } from '@angular/core';
import { IDataResponse } from 'src/app/shared/interface/data-response.interface';
import { IProject } from './interfaces/project.interface';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  tableData!: ITableData;
  searchValue = '';
  constructor(private projectsService: ProjectsService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    let myParams = {
      title: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
    };
    this.projectsService.getProjects(myParams).subscribe({
      next: (res: IDataResponse<IProject>) => {
        this.passDataToTable(res);
        console.log(res);
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
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
          icon: 'visibility',
          callback: (row: IProject) => console.log('view', row),
        },
        {
          type: 'button',
          label: 'Edit',
          icon: 'edit',
          callback: (row: IProject) => console.log('edit', row),
        },
        {
          type: 'button',
          label: 'Delete',
          icon: 'delete',
          callback: (row: IProject) => console.log('delete', row),
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
    this.getProjects();
  }
  clearFilter(): void {
    this.searchValue = '';
    this.getProjects();
  }

  editProject(id: number): void {
    console.log('Edit project:', id);
  }

  deleteProject(id: number): void {
    console.log('Delete project:', id);
  }

}
