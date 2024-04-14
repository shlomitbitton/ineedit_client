import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedingEventComponent } from './needing-event.component';

describe('NeedingEventComponent', () => {
  let component: NeedingEventComponent;
  let fixture: ComponentFixture<NeedingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeedingEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NeedingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
