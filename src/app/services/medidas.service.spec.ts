import { TestBed } from '@angular/core/testing';

import { MedidasService } from './medidas.service';

describe('MedidasService', () => {
  let service: MedidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
