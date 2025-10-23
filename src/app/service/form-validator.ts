import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidator {
  validateDistonicValue = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const dis = control.get('dis')?.value;
      const sys = control.get('sys')?.value;

      if (!sys || !dis) null;

      return sys < dis ? { valuesNotValid: true } : null;
    };
  };

  validateDateTime = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const timeString = control.get('time')?.value;
      const dateString = control.get('date')?.value;

      const dateFromControl = new Date(`${dateString}T${timeString}`);

      if (!dateFromControl) {
        return null;
      }

      return !this.isDatePresent(dateFromControl.getTime())
        ? { dateNotValid: true }
        : null;
    };
  };

  validateFromBeforeTo = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromString = control.get('from')?.value;
      const toString = control.get('to')?.value;

      const fromDate = new Date(`${fromString}`);
      const toDate = new Date(`${toString}`);

      if (!fromDate || !toDate) {
        return null;
      }

      if (!this.isDatePresent(toDate.getTime())) {
        return { dateNotValid: true };
      }

      const isFromBeforeTo = (): boolean => {
        return fromDate.getTime() <= toDate.getTime();
      };
      return !isFromBeforeTo() ? { formIsAfterTo: true } : null;
    };
  };

  private isDatePresent = (timeStamp: number): boolean => {
    return timeStamp <= new Date().getTime();
  };
}
