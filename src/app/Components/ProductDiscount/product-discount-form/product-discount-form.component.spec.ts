import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDiscountFormComponent } from './product-discount-form.component';

describe('ProductDiscountFormComponent', () => {
  let component: ProductDiscountFormComponent;
  let fixture: ComponentFixture<ProductDiscountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDiscountFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
