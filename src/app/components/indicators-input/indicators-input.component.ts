import { Component, inject, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-indicators-input',
  templateUrl: './indicators-input.component.html',
  styleUrls: ['./indicators-input.component.scss'],
  imports: [ReactiveFormsModule, MatButton],
})
export class IndicatorsInputComponent implements OnInit {
  bloodPressureValuesForm!: FormGroup;

  private fb = inject(FormBuilder);
  private formValidator = inject(FormValidator);
  private dateService = inject(CurrentDateTimeService);
  private dataAppendService = inject(DataAppendService);

  currentDate = signal(this.dateService.getCurrentDate());
  currentTime = signal(this.dateService.getCurrentTime());

  constructor() {}

  ngOnInit() {
    this.bloodPressureValuesForm = this.fb.group(
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
        pulse: [
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
    return this.bloodPressureValuesForm.controls;
  }

  get sysControl() {
    return this.bloodPressureValuesForm.get('sys');
  }
  get disControl() {
    return this.bloodPressureValuesForm.get('dis');
  }

  onSubmit = () => {
    const formValues: FormValues = {
      date: this.formControls['date'].value,
      time: this.formControls['time'].value,
      sys: this.sysControl?.value,
      dis: this.disControl?.value,
      pulse: this.formControls['pulse'].value,
    };

    if (this.bloodPressureValuesForm.valid) {
      this.dataAppendService.addNewValues(formValues);
      this.bloodPressureValuesForm.reset();
      this.bloodPressureValuesForm.markAsPristine();
      this.bloodPressureValuesForm.markAsUntouched();
      this.bloodPressureValuesForm.updateValueAndValidity();
      this.currentDate.set(this.dateService.getCurrentDate());
      this.currentTime.set(this.dateService.getCurrentTime());
      this.formControls['date'].setValue(this.currentDate());
      this.formControls['time'].setValue(this.currentTime());
    }
  };
}
