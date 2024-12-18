import { IProject } from "../../projects/interfaces/project.interface";
import { IUser } from "../../users/interfaces/user.interface";

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: string;
  employee: IUser;
  project: IProject;
  createdAt: string;
  updatedAt: string;
}
