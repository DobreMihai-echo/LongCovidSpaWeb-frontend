import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-message-popup',
  templateUrl: './error-message-popup.component.html',
  styleUrls: ['./error-message-popup.component.css'],
})
export class ErrorMessagePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorMessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { errorTitle: string; errorMessage: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
