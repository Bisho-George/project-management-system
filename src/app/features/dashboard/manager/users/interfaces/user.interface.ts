export interface IUser {
  id: number;
  userName: string;
  imagePath: string | null;
  email: string;
  password: string;
  country: string;
  phoneNumber: string;
  verificationCode: string;
  isVerified: boolean;
  isActivated: boolean;
  creationDate: string;
  modificationDate: string;
}
