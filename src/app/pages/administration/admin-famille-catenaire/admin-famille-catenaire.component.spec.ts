import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFamilleCatenaireComponent } from './admin-famille-catenaire.component';

describe('AdminFamilleCatenaireComponent', () => {
  let component: AdminFamilleCatenaireComponent;
  let fixture: ComponentFixture<AdminFamilleCatenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFamilleCatenaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFamilleCatenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
