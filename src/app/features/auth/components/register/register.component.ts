import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { CropDialogComponent } from 'src/app/shared/components/crop-dialog/crop-dialog.component';
import { ICropperDialogResult } from 'src/app/shared/interface/crop-dialog/cropper-dialog.interface';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { IRes } from '../../interfaces/res.interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  croppedImage = signal<ICropperDialogResult | undefined>(undefined);
  resMessage = '';
  isDragging = false;
  isPasswordVisible: { [key: string]: boolean } = {
    password: false,
    confirmPassword: false,
  };

  error!: string;
  files: File[] = [];
  placeholder = computed(
    () => '../../../../../assets/images/svg/profile-picture.svg'
  );

  imageSource = computed(() => {
    if (this.croppedImage()) {
      return this.croppedImage()?.imageUrl;
    }
    return this.placeholder();
  });

  constructor(private dialog: MatDialog, private router: Router, private fb: FormBuilder, private authService: AuthService, private toast: ToastrService) {
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

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const fileEvent = { target: { files: [file] } }; // Mimic file input event
      this.fileSelected(fileEvent);
    }
  }

  onRemove(event: any) {
    event.stopPropagation();
    this.files.splice(this.files.indexOf(event), 1);
    this.croppedImage.set(undefined);
  }

  togglePasswordVisibility(field: string): void {
    this.isPasswordVisible[field] = !this.isPasswordVisible[field];
  }

  private buildFormData(formGroup: FormGroup, fileFields: { [key: string]: Blob | undefined }): FormData {
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

  onSubmit() {
    const formData = this.buildFormData(this.registerForm, { profileImage: this.croppedImage()?.blob });
    this.register(formData);
  }

  fileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const dialogRef = this.dialog.open(CropDialogComponent, {
        data: {
          image: file,
        },
      });
      dialogRef
        .afterClosed()
        .pipe(filter((result) => !!result))
        .subscribe((result) => {
          this.croppedImage.set(result);
        });
    }
  }

  register(data: FormData) {
    this.authService.register(data).subscribe({
      next: (res: IRes) => {
        this.resMessage = res.message;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }, complete: () => {
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
