import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsOutsideComponent } from './items-outside.component';

describe('ItemsOutsideComponent', () => {
  let component: ItemsOutsideComponent;
  let fixture: ComponentFixture<ItemsOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsOutsideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
