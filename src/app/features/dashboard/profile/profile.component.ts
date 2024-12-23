import { ProfileService } from './../../../shared/services/profile.service';
import { Component, computed, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { CropDialogComponent } from 'src/app/shared/components/crop-dialog/crop-dialog.component';
import { ICropperDialogResult } from 'src/app/shared/interface/crop-dialog/cropper-dialog.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { IUserProfile } from 'src/app/shared/interface/user-profile/user-profile-interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SharedModule,],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profileForm: FormGroup;
  baseUrl = 'https://upskilling-egypt.com:3003/';
  croppedImage = signal<ICropperDialogResult | undefined>(undefined);
  user = signal<IUserProfile | null>(null);
  isDragging = false;
  isPasswordVisible: { [key: string]: boolean } = {
    confirmPassword: false,
  };
  files: File[] = [];
  placeholder = computed(
    () => '../../../../assets/images/svg/profile-picture.svg'
  );
  imageSource = computed(() => {
    if (this.croppedImage()) {
      return this.croppedImage()?.imageUrl;
    }
    return this.user()?.imagePath || this.placeholder();
  });

  constructor(private dialog: MatDialog, private router: Router, private fb: FormBuilder, private profileService: ProfileService, private toast: ToastrService) {
    this.profileForm = this.fb.group({
      userName: [null, [Validators.required, Validators.pattern(/^(?=.*\d)[A-Za-z\d]{1,8}$/)]],
      phoneNumber: [null, [Validators.required]],
      country: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      confirmPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)]],
    });
  }

  ngOnInit() {
    this.getUser();
  }

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
      const fileEvent = { target: { files: [file] } };
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

  getUser() {
    this.profileService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.imagePath) {
          user.imagePath = this.baseUrl + user.imagePath;
          this.croppedImage.set({ imageUrl: user.imagePath, blob: undefined });
        }
        this.user.set(user);
        this.profileForm.patchValue(user);
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }

  private buildFormData(formGroup: FormGroup, fileFields: { [key: string]: Blob | undefined }): FormData {
    const formData = new FormData();
    Object.keys(formGroup.controls).forEach((key) => {
      const value = formGroup.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    Object.keys(fileFields).forEach((key) => {
      const file = fileFields[key];
      if (file) {
        formData.append(key, file);
      }
    })
    return formData;
  }

  onSubmit() {
    const formData = this.buildFormData(this.profileForm, { profileImage: this.croppedImage()?.blob });
    this.saveProfile(formData);
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

  saveProfile(data: FormData) {
    this.profileService.updateUserProfile(data).subscribe({
      next: (updateUser: IUserProfile) => {
        this.profileService.user.next(updateUser);
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }, complete: () => {
        this.toast.success('Profile updated successfully');
        localStorage.setItem('userEmail', this.profileForm.get('email')?.value);
        this.router.navigate(['/dashboard']);
      }
    });
  }
  get email() {
    return this.profileForm.get('email');
  }

  get userName() {
    return this.profileForm.get('userName');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }

  get country() {
    return this.profileForm.get('country');
  }

  get confirmPassword() {
    return this.profileForm.get('confirmPassword');
  }
}
