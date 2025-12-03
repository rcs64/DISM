import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoAdminPage } from './listado-admin.page';

describe('ListadoAdminPage', () => {
  let component: ListadoAdminPage;
  let fixture: ComponentFixture<ListadoAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
