import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PecaDetalhe } from './peca-detalhe';

describe('PecaDetalhe', () => {
  let component: PecaDetalhe;
  let fixture: ComponentFixture<PecaDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PecaDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PecaDetalhe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
