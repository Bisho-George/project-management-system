import { ITableData } from 'src/app/shared/interface/table-data.interface';
import { ProjectsService } from './services/projects.service';
import { Component, OnInit } from '@angular/core';

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
      next: (res) => {
        this.tableData.data = res;
        this.tableData.columns = res?.data.map((d: any) => {
          return {
            field: d.name,
            header: d.name
          }
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
