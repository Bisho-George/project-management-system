export interface IJwt {
  userName: string;
  userEmail: string;
  userGroup: string;
  userId: string;
  roles: string[];
  iat: number;
  exp: number;
}
