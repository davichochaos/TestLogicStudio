import { TestBed } from '@angular/core/testing';

import { Transacion } from './transacion';

describe('Transacion', () => {
  let service: Transacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Transacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
