import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin, IResLogin } from '../interfaces/ILogin.interface';
import { IResetPassword } from '../interfaces/IResetPassword.interface';
import { jwtDecode } from 'jwt-decode';
import { IJwt } from '../interfaces/IJwt.interface';
import { IVerifyAccount } from '../interfaces/IVerifyAccount.interface';
import { Router } from '@angular/router';
import { IchangePassword } from '../interfaces/IchangePassword';
import { IRes } from '../interfaces/res.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  role: string | null = '';

  constructor(private _http: HttpClient, private router: Router) {
    if (localStorage.getItem('userToken') !== null) {
      this.getProfile();
    }
  }
  getProfile() {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken: IJwt = jwtDecode(token);
      localStorage.setItem('userName', decodedToken.userName);
      localStorage.setItem('userEmail', decodedToken.userEmail);
      localStorage.setItem('userGroup', decodedToken.userGroup);
      this.getRole();
    }
  }

  getRole() {
    if (localStorage.getItem('userToken') !== null &&
      localStorage.getItem('userGroup') !== null) {
      this.role = localStorage.getItem('userGroup');
    }
  }

  login(data: ILogin) {
    return this._http.post<IResLogin>('Users/Login', data)
  }

  register(data: FormData) {
    return this._http.post<IRes>('Users/Register', data)
  }

  requestResetPassword(email: string) {
    return this._http.post<IRes>('Users/Reset/Request', { email });
  }

  resetPassword(data: IResetPassword) {
    return this._http.post<IRes>('Users/Reset', data);
  }

  verifyAccount(data: IVerifyAccount) {
    return this._http.put<IRes>('Users/verify', data);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
  changePassword(data:IchangePassword){
    return this._http.put<IRes>('Users/ChangePassword',data)
  }
}
