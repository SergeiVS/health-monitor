import { TestBed } from '@angular/core/testing';

import { CurrentDateTimeService } from './current-date-time-service';

describe('CurrentDateTimeService', () => {
  let service: CurrentDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentDateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
