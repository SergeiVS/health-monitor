import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormValues } from 'src/app/models/form-values-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
  imports: [CommonModule, MatTableModule],
  standalone: true,
})
export class ResultsTableComponent  {
  @Input() dataSource!: FormValues[];
  displayedColumns: string[] = ['date', 'time', 'sys', 'dis', 'puls'];

  constructor() {}


}
