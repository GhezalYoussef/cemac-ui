import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeAnalyseComponent } from './mode-analyse.component';

describe('ModeAnalyseComponent', () => {
  let component: ModeAnalyseComponent;
  let fixture: ComponentFixture<ModeAnalyseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeAnalyseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
