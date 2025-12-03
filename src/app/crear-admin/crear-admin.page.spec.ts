import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearAdminPage } from './crear-admin.page';

describe('CrearAdminPage', () => {
  let component: CrearAdminPage;
  let fixture: ComponentFixture<CrearAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
