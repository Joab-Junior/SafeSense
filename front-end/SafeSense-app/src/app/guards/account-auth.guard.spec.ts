import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accountAuthGuard } from './account-auth.guard';

describe('accountAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accountAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
