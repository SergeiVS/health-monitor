import { Component, OnInit } from '@angular/core';
import { ResaultsTableComponent } from 'src/app/components/resaults-table/resaults-table.component';
import { FormValues } from 'src/app/models/form-values-model';
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  imports: [ResaultsTableComponent],
  standalone: true
})
export class SearchResultsComponent implements OnInit {
  public data: FormValues[]=[];

  constructor(
    private filterService: DataFilterService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    const _data = this.filterService.filteredData(); // Call the signal to get the value
    console.log('Data in Component', _data);
    if (_data.length !== 0) {
      this.data = _data; // Assign the value of the signal to this.data
    } else {
      this.modalService.openModal(
        'Keine Werte gefunden',
        'Für gegebenen Zeitraum werden keine Werte gespeichert'
      );
    }
  }
}
