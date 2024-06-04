import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategorieModalComponent } from './admin-categorie-modal.component';

describe('AdminCategorieModalComponent', () => {
  let component: AdminCategorieModalComponent;
  let fixture: ComponentFixture<AdminCategorieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategorieModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCategorieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
