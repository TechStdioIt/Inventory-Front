import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEntryListComponent } from './bill-entry-list.component';

describe('BillEntryListComponent', () => {
  let component: BillEntryListComponent;
  let fixture: ComponentFixture<BillEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillEntryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
