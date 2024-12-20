import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { IRes } from '../../interfaces/res.interface';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent {
  verifyForm: FormGroup;
  resMessage = '';
  error!: string;
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private toast: ToastrService) {
    this.verifyForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      code: [null, [Validators.required]],
    });
  }
  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    this.verifyForm.patchValue({ email })
  }
  onVerify() {
    this.authService.verifyAccount(this.verifyForm.value).subscribe({
      next: (res: IRes) => {
        this.resMessage = res.message;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
      complete: () => {
        this.toast.success(this.resMessage);
        this.router.navigateByUrl('/auth');
      }
    }
    );
  }

  get email() {
    return this.verifyForm.get('email');
  }

  get code() {
    return this.verifyForm.get('code');
  }
}
