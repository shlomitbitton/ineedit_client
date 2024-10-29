import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyDropoffComponent } from './notify-dropoff.component';

describe('NotifyDropoffComponent', () => {
  let component: NotifyDropoffComponent;
  let fixture: ComponentFixture<NotifyDropoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifyDropoffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotifyDropoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
