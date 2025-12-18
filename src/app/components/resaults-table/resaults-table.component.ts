import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormValues } from 'src/app/models/form-values-model';
import { AppRouters } from 'src/app/app.routes';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';
import { ModalService } from 'src/app/service/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resaults-table',
  templateUrl: './resaults-table.component.html',
  styleUrls: ['./resaults-table.component.scss'],
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  standalone: true
})
export class ResaultsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() dataSource!: FormValues[];
  displayedColumns: string[] = ['date', 'time', 'sys', 'dis', 'puls'];

  constructor() {}

  async ngOnInit() {}
}
