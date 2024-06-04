import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeriodiciteModalComponent } from './admin-periodicite-modal.component';

describe('AdminPeriodiciteModalComponent', () => {
  let component: AdminPeriodiciteModalComponent;
  let fixture: ComponentFixture<AdminPeriodiciteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPeriodiciteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPeriodiciteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
