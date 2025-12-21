import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  dialogRef!: MatDialogRef<ModalComponent>;

  openModal(title: string, message: string) {
    this.dialogRef = this.dialog.open<ModalComponent>(ModalComponent, {
      data: { title, message },
    });
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }
}
