import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmFormComponent } from './bm-form.component';

describe('BmFormComponent', () => {
  let component: BmFormComponent;
  let fixture: ComponentFixture<BmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
