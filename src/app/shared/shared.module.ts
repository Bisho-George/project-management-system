import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxDropzoneModule
  ],
  exports: [
    NgxDropzoneModule
  ]
})
export class SharedModule { }
