import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { IRes } from '../../interfaces/res.interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  resMessage = '';
  isHide:boolean = true;
  isHideRePassword:boolean = true;
  isPasswordVisible: { [key: string]: boolean } = {
    password: false,
    confirmPassword: false,
  };
  error!: string;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private toast: ToastrService) {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null,[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)]],
      newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)]],
      confirmNewPassword: [null, [Validators.required]],
    }, { validators: confirmPasswordValidator });
  }
  changePassword() {
    this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: (res: IRes) => {
        console.log(res,'change');

        this.resMessage = res.message;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
      complete: () => {
        this.router.navigate(['/dashboard/home'])
        this.toast.success('Password has been updated successfully');
      }
    }
    );
  }
  togglePasswordVisibility(field: string): void {
    this.isPasswordVisible[field] = !this.isPasswordVisible[field];
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmNewPassword() {
    return this.changePasswordForm.get('confirmNewPassword');
  }
}
