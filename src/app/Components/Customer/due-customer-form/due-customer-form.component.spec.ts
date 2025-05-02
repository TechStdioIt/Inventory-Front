import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueCustomerFormComponent } from './due-customer-form.component';

describe('DueCustomerFormComponent', () => {
  let component: DueCustomerFormComponent;
  let fixture: ComponentFixture<DueCustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueCustomerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
