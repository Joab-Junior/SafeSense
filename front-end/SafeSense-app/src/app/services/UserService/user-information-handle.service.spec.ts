import { TestBed } from '@angular/core/testing';

import { UserInformationHandleService } from './user-information-handle.service';

describe('UserInformationHandleService', () => {
  let service: UserInformationHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInformationHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
