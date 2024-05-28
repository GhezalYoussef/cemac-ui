import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequetesComponent } from './list-requetes.component';

describe('ListRequetesComponent', () => {
  let component: ListRequetesComponent;
  let fixture: ComponentFixture<ListRequetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRequetesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListRequetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
