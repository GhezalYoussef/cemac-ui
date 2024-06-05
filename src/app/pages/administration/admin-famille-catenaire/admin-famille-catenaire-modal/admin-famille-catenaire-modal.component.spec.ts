import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFamilleCatenaireModalComponent } from './admin-famille-catenaire-modal.component';

describe('AdminFamilleCatenaireModalComponent', () => {
  let component: AdminFamilleCatenaireModalComponent;
  let fixture: ComponentFixture<AdminFamilleCatenaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFamilleCatenaireModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFamilleCatenaireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
