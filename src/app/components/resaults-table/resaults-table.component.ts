import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormValues } from 'src/app/models/form-values-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resaults-table',
  templateUrl: './resaults-table.component.html',
  styleUrls: ['./resaults-table.component.scss'],
  imports: [CommonModule, MatTableModule],
  standalone: true,
})
export class ResaultsTableComponent implements OnInit {
  @Input() dataSource!: FormValues[];
  displayedColumns: string[] = ['date', 'time', 'sys', 'dis', 'puls'];

  constructor() {}

  ngOnInit() {}
}
