import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuePaymentListComponent } from './due-payment-list.component';

describe('DuePaymentListComponent', () => {
  let component: DuePaymentListComponent;
  let fixture: ComponentFixture<DuePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuePaymentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
