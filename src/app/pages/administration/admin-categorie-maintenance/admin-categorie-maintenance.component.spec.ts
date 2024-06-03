import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategorieMaintenanceComponent } from './admin-categorie-maintenance.component';

describe('AdminCategorieMaintenanceComponent', () => {
  let component: AdminCategorieMaintenanceComponent;
  let fixture: ComponentFixture<AdminCategorieMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategorieMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCategorieMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
