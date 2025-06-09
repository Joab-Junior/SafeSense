import { TestBed } from '@angular/core/testing';

import { AlertHistoryService } from './alert-history.service';

describe('AlertHistoryService', () => {
  let service: AlertHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
