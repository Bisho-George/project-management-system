import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  resMessage = '';
  isPasswordVisible: { [key: string]: boolean } = {
    password: false,
    confirmPassword: false,
  };

  error!: string;
  files: File[] = [];

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private toast: ToastrService) {
    this.registerForm = this.fb.group({
      userName: [null, [Validators.required, Validators.pattern(/^(?=.*\d)[A-Za-z\d]{1,8}$/)]],
      phoneNumber: [null, [Validators.required]],
      country: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)]],
      confirmPassword: [null, [Validators.required]],
    }, { validators: confirmPasswordValidator });
  }

  ngOnInit() { }

  onSelect(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  togglePasswordVisibility(field: string): void {
    this.isPasswordVisible[field] = !this.isPasswordVisible[field];
  }

  private buildFormData(formGroup: FormGroup, fileFields: { [key: string]: File }): FormData {
    const formData = new FormData();

    // Add all form control values
    Object.keys(formGroup.controls).forEach((key) => {
      const value = formGroup.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    // Add file if provided
    Object.keys(fileFields).forEach((key) => {
      const file = fileFields[key];
      if (file) {
        formData.append(key, file);
      }
    })

    return formData;
  }

  onRegister() {
    const form = this.buildFormData(this.registerForm, { profileImage: this.files[0] });
    console.log(form.get('profileImage'));
    this.authService.register(form).subscribe({
      next: (res:any) => {
        console.log(res);
        this.resMessage = res.message;
      },
      error: (err) => this.toast.error(err.error.message),
      complete: () => {
        this.toast.success(this.resMessage);
        localStorage.setItem('userEmail', this.registerForm.get('email')?.value);
        this.router.navigateByUrl('auth/verify-email');
      }
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get userName() {
    return this.registerForm.get('userName');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get country() {
    return this.registerForm.get('country');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

}
