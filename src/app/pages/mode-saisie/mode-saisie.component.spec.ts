import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeSaisieComponent } from './mode-saisie.component';

describe('ModeSaisieComponent', () => {
  let component: ModeSaisieComponent;
  let fixture: ComponentFixture<ModeSaisieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeSaisieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
