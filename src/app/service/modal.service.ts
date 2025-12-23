import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private dialog = inject(MatDialog);
  dialogRef!: MatDialogRef<ModalComponent>;

  constructor() {}

  openModal(title: string, message: string) {
    this.dialogRef = this.dialog.open<ModalComponent>(ModalComponent, {
      data: { title, message },
    });
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }
}
