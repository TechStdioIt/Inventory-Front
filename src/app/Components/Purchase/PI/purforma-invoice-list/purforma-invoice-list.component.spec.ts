import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurformaInvoiceListComponent } from './purforma-invoice-list.component';

describe('PurformaInvoiceListComponent', () => {
  let component: PurformaInvoiceListComponent;
  let fixture: ComponentFixture<PurformaInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurformaInvoiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurformaInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
