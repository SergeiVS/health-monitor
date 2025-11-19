import { TestBed } from '@angular/core/testing';

import { DataAppendService } from './data-append.service';

describe('DataAppendService', () => {
  let service: DataAppendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAppendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
