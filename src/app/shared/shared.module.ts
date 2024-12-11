import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { CropDialogComponent } from './components/crop-dialog/crop-dialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from './components/table/table.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    CropDialogComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ImageCropperModule,
    MatIconModule,
    MatTableModule,
  ],
  exports: [
    NgxDropzoneModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CropDialogComponent,
    MatIconModule,
    TableComponent
  ]
})
export class SharedModule { }
