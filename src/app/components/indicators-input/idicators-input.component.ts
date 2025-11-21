import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CurrentDateTimeService } from 'src/app/service/current-date-time-service';
import { FormValidator } from 'src/app/service/form-validator';
import { FormValues } from '../../models/form-values-model';
import { DataAppendService } from 'src/app/service/google-service/data-append.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-idicators-input',
  templateUrl: './idicators-input.component.html',
  styleUrls: ['./idicators-input.component.scss'],
  imports: [ReactiveFormsModule, MatButton],
})
export class BloodPresureInputForm implements OnInit {
  bloodPresureValuesForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formValidator: FormValidator,
    private dateService: CurrentDateTimeService,
    private dataAppendService: DataAppendService
  ) {}

  currentDate = signal(this.dateService.getCurrentDate());
  currentTime = signal(this.dateService.getCurrentTime());

  ngOnInit() {
    this.bloodPresureValuesForm = this.fb.group(
      {
        date: [this.currentDate(), Validators.required],
        time: [this.currentTime(), Validators.required],
        sys: [
          '',
          [Validators.required, Validators.max(250), Validators.min(70)],
        ],
        dis: [
          '',
          [Validators.required, Validators.max(250), Validators.min(40)],
        ],
        puls: [
          '',
          [Validators.required, Validators.max(200), Validators.min(20)],
        ],
      },
      {
        validators: [
          this.formValidator.validateDistonicValue(),
          this.formValidator.validateDateTime(),
        ],
      }
    );
  }
  get formControls() {
    return this.bloodPresureValuesForm.controls;
  }

  get sysControl() {
    return this.bloodPresureValuesForm.get('sys');
  }
  get disControl() {
    return this.bloodPresureValuesForm.get('dis');
  }

  onSubmit = () => {
    const formValues: FormValues = {
      date: this.formControls['date'].value,
      time: this.formControls['time'].value,
      sys: this.sysControl?.value,
      dis: this.disControl?.value,
      puls: this.formControls['puls'].value,
    };

    if (this.bloodPresureValuesForm.valid) {
      console.log(JSON.stringify(formValues));
      this.dataAppendService.addNewValues(formValues);
      this.bloodPresureValuesForm.reset();
      this.bloodPresureValuesForm.markAsPristine();
      this.bloodPresureValuesForm.markAsUntouched();
      this.bloodPresureValuesForm.updateValueAndValidity();
      this.currentDate.set(this.dateService.getCurrentDate());
      this.currentTime.set(this.dateService.getCurrentTime());
      this.formControls['date'].setValue(this.currentDate());
      this.formControls['time'].setValue(this.currentTime());
    }
  };
}
