import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITableData } from '../../interface/table-data.interface';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableData!: ITableData;
  @Output() pageChange = new EventEmitter<{ pageNumber: number, pageSize: number }>();
  pageNumber = 1;
  pageSize = 5;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [];
  projectNames: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer) {  }

  ngOnInit(): void {
    this.initializeTable();
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'creationDate') {
        return new Date(item.creationDate);
      }
      return item[property];
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && changes['tableData'].currentValue) {
      this.initializeTable();
    }
  }

  initializeTable(): void {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns.map((c) => c.field);
      if (this.tableData.actions?.length) {
        this.displayedColumns.push('actions');
      }
      this.dataSource.data = this.tableData?.data?.data;
      if (this.sort && this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
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

  updatePagination(): void {
    if (this.paginator) {
      console.log(this.tableData);
      this.paginator.pageIndex = this.tableData.data.pageNumber;
      this.paginator.pageSize = this.tableData.data.pageSize;
      this.paginator.length = this.tableData.data.totalNumberOfRecords;
    }
  }

  handlePageEvent(event: PageEvent): void {
    this.pageChange.emit({ pageNumber: event.pageIndex, pageSize: event.pageSize });
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}

