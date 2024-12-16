import { Component } from '@angular/core';
import { TasksService } from './services/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
tableData!: any;
resData:any;
  searchValue = '';
  constructor(private _TasksService: TasksService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    let myParams = {
      title: this.searchValue,
      pageNumber: this.tableData?.data.pageNumber,
      pageSize: this.tableData?.data.pageSize,
    };
    this._TasksService.getTasks(myParams).subscribe({
      next: (res: any) => {
        this.passDataToTable(res);
        console.log(res);
        this.resData =  res.data
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
          callback: (row: any) => console.log('view', row),
        },
        {
          type: 'button',
          label: 'Edit',
          icon: 'edit',
          callback: (row: any) => console.log('edit', row),
        },
        {
          type: 'button',
          label: 'Delete',
          icon: 'delete',
          callback: (row: any) => console.log('delete', row),
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
