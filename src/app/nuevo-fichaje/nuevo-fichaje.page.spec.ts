import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoFichajePage } from './nuevo-fichaje.page';

describe('NuevoFichajePage', () => {
  let component: NuevoFichajePage;
  let fixture: ComponentFixture<NuevoFichajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoFichajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
