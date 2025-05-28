import { TestBed } from '@angular/core/testing';

import { DeleteAccountHandleService } from './delete-account-handle.service';

describe('DeleteAccountHandleService', () => {
  let service: DeleteAccountHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteAccountHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
