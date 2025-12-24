import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [MatIcon],
})
export class ModalComponent {
  private modalRef = inject(MatDialogRef<ModalComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) // private modalRef: MatDialogRef<ModalComponent>
  {}

  close() {
    this.modalRef.close();
  }
}
