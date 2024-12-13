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
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    CropDialogComponent,
    TableComponent,
    NavbarComponent,
    HomeComponent,
    SidebarComponent
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
    MatPaginatorModule
  ],
  exports: [
    NgxDropzoneModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CropDialogComponent,
    MatIconModule,
    TableComponent,
    NavbarComponent,
    HomeComponent,
    MatPaginatorModule
    SidebarComponent
  ]
})
export class SharedModule { }
