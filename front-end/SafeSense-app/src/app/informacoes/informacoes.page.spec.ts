import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacoesPage } from './informacoes.page';

describe('InformacoesPage', () => {
  let component: InformacoesPage;
  let fixture: ComponentFixture<InformacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
