import { Component, linkedSignal, OnInit } from '@angular/core';
import { ResaultsTableComponent } from 'src/app/components/resaults-table/resaults-table.component';
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  imports: [ResaultsTableComponent],
  standalone: true,
})
export class SearchResultsComponent implements OnInit {
  public data = linkedSignal(() => this.filterService.filteredData());

  constructor(
    private filterService: DataFilterService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Check if data is empty and show modal if true
    if (this.data().length === 0) {
      this.modalService.openModal(
        'Keine Werte gefunden',
        'Für gegebenen Zeitraum werden keine Werte gespeichert'
      );
    }
  }
}
