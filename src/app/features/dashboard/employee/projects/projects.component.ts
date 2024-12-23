import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IDataResponse } from 'src/app/shared/interface/api-data-response/data-response.interface';
import { ITableData } from 'src/app/shared/interface/table/table-data.interface';
import { IProject } from './interfaces/project.interface';
import { ProjectsService } from './services/projects.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableTypeEnum } from 'src/app/shared/enums/table-type-enum';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  tableData: ITableData;
  tableType = TableTypeEnum.Projects;
  pageNumber = 1;
  pageSize = 5;
  totalNumberOfRecords = 0;
  searchValue = '';

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

  getProjects() {
    let employeeParams = {
      title: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
    };
    this.projectsService.getProjects(employeeParams).subscribe({
      next: (res: IDataResponse<IProject>) => {
        this.passDataToTable(res);
        this.pageNumber = res.pageNumber;
        this.pageSize = res.pageSize;
        this.totalNumberOfRecords = res.totalNumberOfRecords
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
        actions: []
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
    this.getProjects();
  }

  clearFilter(): void {
    this.searchValue = '';
    this.getProjects();
  }

  handlePageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.getProjects();
  }
}
