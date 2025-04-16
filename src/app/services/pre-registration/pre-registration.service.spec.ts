import { TestBed } from '@angular/core/testing';

import { PreRegistrationService } from './pre-registration.service';

describe('PreRegistrationService', () => {
  let service: PreRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
