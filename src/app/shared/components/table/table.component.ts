import { ITableData } from 'src/app/shared/interface/table/table-data.interface';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableTypeEnum } from '../../enums/table-type-enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  data: ITableData | null = null;
  @Input() type: TableTypeEnum = TableTypeEnum.Users;
  @Input() set tableData(data: ITableData) {
    this.data = data;
    console.log('tableData', data);
    this.initializeTable(data);
  }
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [];
  projectNames: string[] = [];
  defaultImage = '../../../../assets/images/svg/profile-picture-placeholder.svg';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'creationDate') {
        return new Date(item.creationDate);
      }
      return item[property];
    };
  }

  initializeTable(tableData: ITableData): void {
    if (!tableData || !tableData.data?.data) {
      return;
    }
    this.displayedColumns = tableData.columns.map((c) => c.field);
    if (tableData.actions?.length) {
      this.displayedColumns.push('actions');
    }
    this.dataSource.data = tableData.data.data;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }


  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isArray(element: any) {
    return Array.isArray(element);
  }

  getTemplate(field: string): any {
    console.log(field);
    switch (field) {
      case 'task': return 'arrayTemplate';
      case 'creationDate': return 'dateTemplate';
      case 'modificationDate': return 'dateTemplate';
      case 'imagePath': return 'imageTemplate';
      case 'isActive': return 'booleanTemplate';
      case 'project': return 'projectTemplate';
      case 'employee': return 'employeeTemplate';
      default: return 'defaultTemplate';
    }
  }

}

