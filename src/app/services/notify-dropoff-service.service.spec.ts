import { TestBed } from '@angular/core/testing';

import { NotifyDropoffService } from './notify-dropoff.service';

describe('NotifyDropoffServiceService', () => {
  let service: NotifyDropoffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyDropoffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
