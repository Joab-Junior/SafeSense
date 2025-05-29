import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemaPage } from './tema.page';

describe('TemaPage', () => {
  let component: TemaPage;
  let fixture: ComponentFixture<TemaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TemaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
