import { TestBed } from '@angular/core/testing';

import { EncomendasService } from './encomendas.service';

describe('EncomendasService', () => {
  let service: EncomendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncomendasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
