import { Component, effect, EventEmitter, Inject, Output, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ICropperDialogResult } from '../../interface/crop-dialog/cropper-dialog.interface';

@Component({
  selector: 'app-crop-dialog',
  templateUrl: './crop-dialog.component.html',
  styleUrls: ['./crop-dialog.component.scss']
})
export class CropDialogComponent {
  result = signal<ICropperDialogResult | undefined>(undefined);
  @Output() imageReady = new EventEmitter<Blob>();

  constructor(
    private dialogRef: MatDialogRef<CropDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {image: File}
  ) {
    effect(() => {
      if (this.result()) {
        this.imageReady.emit(this.result()?.blob);
      }
    });
  }

  onImageCropped(event: ImageCroppedEvent): void {
    const { blob, objectUrl } = event;
    if (blob && objectUrl) {
      this.result.set({ blob, imageUrl: objectUrl });
    }
  }
  // onImageLoaded(): void {
  // }

  // onCropperReady(): void {
  // }

  // onLoadImageFailed(): void {
  // }
  onCancel(): void {
    this.dialogRef.close(null); // Close dialog without saving
  }

  onConfirm(): void {
    this.dialogRef.close(this.result()); // Close dialog with cropped image
  }
}
