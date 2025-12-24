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
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';
import { TimeRange } from 'src/app/models/time-range-model';
import { ModalService } from 'src/app/service/modal.service';
import { Router } from '@angular/router';

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
    private dataFilter: DataFilterService,
    private modalService: ModalService,
    private router: Router
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
      await this.dataFilter.loadDataOnRequest(timeRange);
      this.router.navigate(['statistics/results']);
    } else {
      this.modalService.openModal(
        $localize`:error|@@error:Error`,
        $localize`:error|@@invalidForm:The form is invalid. Please check your input.`
      );
    }
    this.timeRangeForm.reset({
      from: this.currentDate(),
      to: this.currentDate(),
    });
    this.timeRangeForm.markAsPristine();
  };

  get from() {
    return this.timeRangeForm.get('from');
  }

  get to() {
    return this.timeRangeForm.get('to');
  }
}
