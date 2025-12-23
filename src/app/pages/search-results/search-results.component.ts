import { Component, inject, linkedSignal, OnInit } from '@angular/core';
import { ResaultsTableComponent } from 'src/app/components/resaults-table/resaults-table.component';
import { DataFilterService } from 'src/app/service/google-service/data-filter.service';
import { ModalService } from 'src/app/service/modal.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  imports: [ResaultsTableComponent, MatIcon, MatIconButton],
  standalone: true,
})
export class SearchResultsComponent implements OnInit {
  public data = linkedSignal(() => this.filterService.filteredData());

  private filterService = inject(DataFilterService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  constructor() {}

  ngOnInit() {
    // Check if data is empty and show modal if true
    if (this.data().length === 0) {
      this.modalService.openModal(
        'Keine Werte gefunden',
        'Für gegebenen Zeitraum werden keine Werte gespeichert'
      );
    }
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
  navigateBack() {
    this.router.navigate(['/statistics']);
  }
}
