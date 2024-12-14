import { IDataResponse } from "./data-response.interface";
import { ITableColumn } from "./table-column.interface";
export interface ITableAction {
  type: 'icon' | 'button'; // Action type
  label?: string;          // For buttons
  icon?: string;           // For icon actions (e.g., Material Icon name)
  callback: (row: any) => void; // Function to execute
}

export interface ITableData {
  data: IDataResponse<any>;
  columns: ITableColumn[];
  actions: ITableAction[] ;
}
