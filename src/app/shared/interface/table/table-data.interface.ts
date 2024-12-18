import { IDataResponse } from "../api-data-response/data-response.interface";
export interface ITableAction {
  type: 'icon' | 'button';
  color?: string;
  label?: string;
  icon?: string;
  callback: (row: any) => void;
}
export interface ITableColumn {
  field: string;
  header: string;
}

export interface ITableData {
  data: IDataResponse<any>;
  columns: ITableColumn[];
  actions: ITableAction[];
}
