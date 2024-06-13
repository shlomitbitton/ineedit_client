import { TestBed } from '@angular/core/testing';

import { PublicNeedsService } from './public-needs.service';

describe('PublicNeedsService', () => {
  let service: PublicNeedsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicNeedsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
