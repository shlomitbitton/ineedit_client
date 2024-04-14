import { TestBed } from '@angular/core/testing';

import { NeedingEventService } from './needing-event.service';

describe('NeedingEventService', () => {
  let service: NeedingEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeedingEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
