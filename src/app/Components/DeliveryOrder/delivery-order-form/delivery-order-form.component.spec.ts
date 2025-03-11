import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrderFormComponent } from './delivery-order-form.component';

describe('DeliveryOrderFormComponent', () => {
  let component: DeliveryOrderFormComponent;
  let fixture: ComponentFixture<DeliveryOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryOrderFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
