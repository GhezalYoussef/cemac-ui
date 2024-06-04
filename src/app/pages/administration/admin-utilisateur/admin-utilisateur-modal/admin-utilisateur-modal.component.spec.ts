import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUtilisateurModalComponent } from './admin-utilisateur-modal.component';

describe('AdminUtilisateurModalComponent', () => {
  let component: AdminUtilisateurModalComponent;
  let fixture: ComponentFixture<AdminUtilisateurModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUtilisateurModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUtilisateurModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
