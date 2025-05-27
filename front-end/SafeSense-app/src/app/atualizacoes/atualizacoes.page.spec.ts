import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtualizacoesPage } from './atualizacoes.page';

describe('AtualizacoesPage', () => {
  let component: AtualizacoesPage;
  let fixture: ComponentFixture<AtualizacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AtualizacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
