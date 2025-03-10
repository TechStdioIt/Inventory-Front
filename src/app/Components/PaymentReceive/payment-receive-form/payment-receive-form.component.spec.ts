import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReceiveFormComponent } from './payment-receive-form.component';

describe('PaymentReceiveFormComponent', () => {
  let component: PaymentReceiveFormComponent;
  let fixture: ComponentFixture<PaymentReceiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReceiveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentReceiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
