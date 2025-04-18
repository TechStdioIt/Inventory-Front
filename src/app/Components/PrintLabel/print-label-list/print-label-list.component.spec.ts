import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLabelListComponent } from './print-label-list.component';

describe('PrintLabelListComponent', () => {
  let component: PrintLabelListComponent;
  let fixture: ComponentFixture<PrintLabelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintLabelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintLabelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
