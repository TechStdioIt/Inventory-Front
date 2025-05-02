import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueCustomerListComponent } from './due-customer-list.component';

describe('DueCustomerListComponent', () => {
  let component: DueCustomerListComponent;
  let fixture: ComponentFixture<DueCustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueCustomerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
