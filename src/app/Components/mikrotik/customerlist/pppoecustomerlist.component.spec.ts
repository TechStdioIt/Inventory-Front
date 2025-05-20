import { ComponentFixture, TestBed } from '@angular/core/testing';

import { pppoeCustomerlistComponent } from './pppoecustomerlist.component';

describe('pppoeCustomerlistComponent', () => {
  let component: pppoeCustomerlistComponent;
  let fixture: ComponentFixture<pppoeCustomerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [pppoeCustomerlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(pppoeCustomerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
