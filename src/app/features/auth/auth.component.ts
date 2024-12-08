import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm: FormGroup;
  isPasswordVisible = false;
  error!: string;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private toast: ToastrService) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
      )]]
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  onLogin() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('userToken', res.token);
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
      complete: () => {
        this.toast.success('User logged in successfully')
        this.authService.getProfile();
        if (this.authService.role === 'SystemUser') {
          this.router.navigateByUrl('/dashboard/user');
        }
        else if (this.authService.role === 'SuperAdmin') {
          this.router.navigateByUrl('/dashboard/admin');
        }
      }
    });
  }
  
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
