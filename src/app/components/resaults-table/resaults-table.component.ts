import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormValues } from 'src/app/models/form-values-model';
import { AppRouters } from 'src/app/app.routes';
import { MatPaginator } from '@angular/material/paginator';
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';

@Component({
  selector: 'app-resaults-table',
  templateUrl: './resaults-table.component.html',
  styleUrls: ['./resaults-table.component.scss'],
  imports: [AppRouters, MatTableModule, MatPaginator],
})
export class ResaultsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() dataSource!: MatTableDataSource<FormValues>;
  displayedColumns: string[] = ['date', 'time', 'sys', 'dis', 'puls'];

constructor(private filterService: DataFilterService) {}

 async ngOnInit() {
    this.dataSource = new MatTableDataSource(this.filterService.filteredData);
    if (this.dataSource.data.length === 0) {
      // Handle the case when there is no data to display
      console.warn('No data available to display in the results table.');
    }
    this.dataSource.paginator = this.paginator;
  }
}
