import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() pageSize = 5;
  @Input() pageNumber = 1;
  @Input() totalRecords = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Output() pageChange = new EventEmitter<{ pageNumber: number; pageSize: number }>();
  constructor() {
  }
  onPageChange(event: PageEvent): void {
    this.pageChange.emit({ pageNumber: event.pageIndex + 1, pageSize: event.pageSize });
  }
}
