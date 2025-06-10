import { TestBed } from '@angular/core/testing';

import { ChangePasswordHandlerService } from './change-password-handler.service';

describe('ChangePasswordHandlerService', () => {
  let service: ChangePasswordHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePasswordHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
