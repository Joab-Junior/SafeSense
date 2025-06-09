import { TestBed } from '@angular/core/testing';

import { AlertCheckService } from './alert-check.service';

describe('AlertCheckService', () => {
  let service: AlertCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
