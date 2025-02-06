import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTypeFormComponent } from './purchase-type-form.component';

describe('PurchaseTypeFormComponent', () => {
  let component: PurchaseTypeFormComponent;
  let fixture: ComponentFixture<PurchaseTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
