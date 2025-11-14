import { ComponentFixture, TestBed } from '@angular/core/testing';

import { encomendas } from './encomendas';

describe('encomendas', () => {
  let component: encomendas;
  let fixture: ComponentFixture<encomendas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [encomendas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(encomendas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
