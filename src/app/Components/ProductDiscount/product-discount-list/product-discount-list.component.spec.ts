import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDiscountListComponent } from './product-discount-list.component';

describe('ProductDiscountListComponent', () => {
  let component: ProductDiscountListComponent;
  let fixture: ComponentFixture<ProductDiscountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDiscountListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
