import { Component, OnInit } from '@angular/core';
import { TimeRangeFormComponent } from '../../components/time-range-form/time-range-form.component';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports: [TimeRangeFormComponent],
})
export class StatisticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
