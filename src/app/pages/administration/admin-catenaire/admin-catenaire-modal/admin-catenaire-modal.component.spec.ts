import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatenaireModalComponent } from './admin-catenaire-modal.component';

describe('AdminCatenaireModalComponent', () => {
  let component: AdminCatenaireModalComponent;
  let fixture: ComponentFixture<AdminCatenaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatenaireModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCatenaireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
