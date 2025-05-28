import { TestBed } from '@angular/core/testing';

import { AccountAuthHandleService } from './account-auth-handle.service';

describe('AccountAuthHandleService', () => {
  let service: AccountAuthHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountAuthHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
