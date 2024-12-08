import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../interfaces/ILogin.interface';
import { IResetPassword } from '../interfaces/IResetPassword.interface';
import { jwtDecode } from 'jwt-decode';
import { IJwt } from '../interfaces/IJwt.interface';
import { IVerifyAccount } from '../interfaces/IVerifyAccount.interface';
import { Router } from '@angular/router';

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
    return this._http.post('Users/Login', data)
  }

  register(data: FormData) {
    return this._http.post('Users/Register', data)
  }

  requestResetPassword(email: string) {
    return this._http.post('Users/Reset/Request', { email });
  }

  resetPassword(data: IResetPassword) {
    return this._http.post('Users/Reset', data);
  }

  verifyAccount(data: IVerifyAccount) {
    return this._http.put('Users/verify', data);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}
