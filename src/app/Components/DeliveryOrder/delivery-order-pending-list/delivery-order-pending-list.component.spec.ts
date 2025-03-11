import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrderPendingListComponent } from './delivery-order-pending-list.component';

describe('DeliveryOrderPendingListComponent', () => {
  let component: DeliveryOrderPendingListComponent;
  let fixture: ComponentFixture<DeliveryOrderPendingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryOrderPendingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryOrderPendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
