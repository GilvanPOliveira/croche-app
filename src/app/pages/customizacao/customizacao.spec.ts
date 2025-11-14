import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customizacao } from './customizacao';

describe('Customizacao', () => {
  let component: Customizacao;
  let fixture: ComponentFixture<Customizacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customizacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customizacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
