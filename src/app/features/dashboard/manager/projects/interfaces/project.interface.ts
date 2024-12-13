import { ITask } from "../../tasks/interfaces/task.interface";

export interface IProject {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  modificationDate: string;
  task: ITask[];
}
