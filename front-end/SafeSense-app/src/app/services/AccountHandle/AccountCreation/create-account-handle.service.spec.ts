import { TestBed } from '@angular/core/testing';

import { CreateAccountHandleService } from './create-account-handle.service';

describe('CreateAccountHandleService', () => {
  let service: CreateAccountHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAccountHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
