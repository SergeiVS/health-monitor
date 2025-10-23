import { TestBed } from '@angular/core/testing';

import { FormValidator } from './form-validator';

describe('FormValidator', () => {
  let service: FormValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
