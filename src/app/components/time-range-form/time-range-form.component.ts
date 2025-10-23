import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { CurrentDateTimeService } from 'src/app/service/current-date-time-service';
import { FormValidator } from 'src/app/service/form-validator';

@Component({
  selector: 'app-time-range-form',
  templateUrl: './time-range-form.component.html',
  styleUrls: ['./time-range-form.component.scss'],
  imports: [ReactiveFormsModule, MatButtonModule],
})
export class TimeRangeFormComponent implements OnInit {
  constructor(
    private dateService: CurrentDateTimeService,
    private fb: FormBuilder,
    private formValidator: FormValidator
  ) {}

  timeRangeForm!: FormGroup;
  currentDate = signal(this.dateService.getCurrentDate());

  ngOnInit() {
    this.timeRangeForm = this.fb.group(
      {
        from: [this.currentDate(), Validators.required],
        to: [this.currentDate(), Validators.required],
      },
      {
        validators: [this.formValidator.validateFromBeforeTo()],
      }
    );
  }

  onSubmit = () => {};

  get from(){
    return this.timeRangeForm.get('from')
  }

  get to(){
    return this.timeRangeForm.get('to')
  }
  
}
