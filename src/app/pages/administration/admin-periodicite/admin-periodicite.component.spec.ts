import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeriodiciteComponent } from './admin-periodicite.component';

describe('AdminPeriodiciteComponent', () => {
  let component: AdminPeriodiciteComponent;
  let fixture: ComponentFixture<AdminPeriodiciteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPeriodiciteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPeriodiciteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
