import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNeedsComponent } from './public-needs.component';

describe('PublicNeedsComponent', () => {
  let component: PublicNeedsComponent;
  let fixture: ComponentFixture<PublicNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicNeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
