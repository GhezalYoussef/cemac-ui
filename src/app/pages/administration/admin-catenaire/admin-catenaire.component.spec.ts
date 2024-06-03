import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatenaireComponent } from './admin-catenaire.component';

describe('AdminCatenaireComponent', () => {
  let component: AdminCatenaireComponent;
  let fixture: ComponentFixture<AdminCatenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatenaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCatenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
