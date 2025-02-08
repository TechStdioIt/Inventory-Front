import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurformaInvoiceFormComponent } from './purforma-invoice-form.component';

describe('PurformaInvoiceFormComponent', () => {
  let component: PurformaInvoiceFormComponent;
  let fixture: ComponentFixture<PurformaInvoiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurformaInvoiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurformaInvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
