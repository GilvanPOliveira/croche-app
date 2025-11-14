import { TestBed } from '@angular/core/testing';

import { LinhasService } from './linhas.service';

describe('LinhasService', () => {
  let service: LinhasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinhasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
