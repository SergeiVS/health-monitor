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
import { DataAppendService } from 'src/app/service/google-service/data-append.service';
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';
import { DriveService } from 'src/app/service/google-service/drive.service';
import { environment } from 'src/environments/environment';

export interface TimeRange {
  from: string;
  to: string;
}

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
    private formValidator: FormValidator,
    private dataService: DataFilterService
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

  onSubmit = async () => {
    if (this.timeRangeForm.valid) {
      const timeRange: TimeRange = {
        from: this.from?.value,
        to: this.to?.value,
      };
      const filteredData = await this.dataService.getDataFilter(timeRange);
      console.log('Filtered Data:', filteredData);
    }
  };

  get from() {
    return this.timeRangeForm.get('from');
  }

  get to() {
    return this.timeRangeForm.get('to');
  }
}
