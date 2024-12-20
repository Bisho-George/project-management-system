import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { IRes } from '../../interfaces/res.interface';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {
  requestForm: FormGroup;
  resMessage = '';
  isPasswordVisible = false;
  error!: string;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private toast: ToastrService) {
    this.requestForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  onRequest() {
    this.authService.requestResetPassword(this.requestForm.get('email')?.value).subscribe({
      next: (res: IRes) => {
        this.resMessage = res.message;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
      complete: () => {
        localStorage.setItem('userEmail', this.requestForm.get('email')?.value);
        this.toast.success(this.resMessage);
        this.router.navigateByUrl('auth/reset-password');
      }
    }
    );
  }

  get email() {
    return this.requestForm.get('email');
  }
}
