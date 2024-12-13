import { ITableData } from 'src/app/shared/interface/table-data.interface';
import { ProjectsService } from './services/projects.service';
import { Component, OnInit } from '@angular/core';
import { IDataResponse } from 'src/app/shared/interface/data-response.interface';
import { IProject } from './interfaces/project.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  constructor(private projectsService: ProjectsService) { }
  tableData!: ITableData;

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe({
      next: (res: IDataResponse<IProject>) => {
        if (res.data.length > 0) {
          const excludedFields = ['id']
          const sampleProject = res.data[0]; // Take the first project as a sample

          this.tableData = {
            data: res.data,
            columns: Object.keys(sampleProject).filter((key) => !excludedFields.includes(key)).map((key) => ({
              field: key,
              header: this.formatHeader(key),
            })),
          };
        } else {
          // Handle the case where no data is returned
          this.tableData = {
            data: [],
            columns: [],
          };
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  }
}
