export interface IUserProfile {
  id: number;
  userName: string;
  email: string;
  country: string;
  phoneNumber: string;
  imagePath: string;
  isActivated: true;
  group: {
    id: number;
    name: string;
    creationDate: string;
    modificationDate: string;
  };
  creationDate: string;
  modificationDate: string;
}
