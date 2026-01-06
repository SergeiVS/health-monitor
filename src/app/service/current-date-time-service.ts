import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrentDateTimeService {
  private date: Date = new Date();
  private month = this.date.getMonth() < 12 ? this.date.getMonth() + 1 : 1;

  getCurrentDate = () => {
    const formattedMonth = this.month < 10 ? `0${this.month}` : `${this.month}`;
    const formattedDay = (new Date().getDate() < 10 ? '0' : '') + new Date().getDate();
    return `${this.date.getFullYear()}-${formattedMonth}-${formattedDay}`;
  };

  getCurrentTime = () => {
    return `${new Date().getHours()}:${
      (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
    }`;
  };
}
