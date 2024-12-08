import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './components/register/register.component';
import { RequestResetPasswordComponent } from './components/request-reset-password/request-reset-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';

@NgModule({
  declarations: [
    AuthComponent,
    RegisterComponent,
    RequestResetPasswordComponent,
    ResetPasswordComponent,
    VerifyAccountComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AuthModule { }
