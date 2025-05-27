import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegurancaPage } from './seguranca.page';

describe('SegurancaPage', () => {
  let component: SegurancaPage;
  let fixture: ComponentFixture<SegurancaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SegurancaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
