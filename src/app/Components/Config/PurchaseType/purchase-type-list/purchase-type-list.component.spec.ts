import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTypeListComponent } from './purchase-type-list.component';

describe('PurchaseTypeListComponent', () => {
  let component: PurchaseTypeListComponent;
  let fixture: ComponentFixture<PurchaseTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
