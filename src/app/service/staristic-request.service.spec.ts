import { TestBed } from '@angular/core/testing';

import { StaristicRequestService } from './staristic-request.service';

describe('StaristicRequestService', () => {
  let service: StaristicRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaristicRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
