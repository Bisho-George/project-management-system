import { IUser } from "../../../manager/users/interfaces/user.interface";
import { IProject } from "../../projects/interfaces/project.interface";

export interface IUserTask {
  id: number;
  title: string;
  description: string;
  status: string;
  creationDate: string;
  modificationDate: string;
  employee: IUser;
  project: IProject;
}
