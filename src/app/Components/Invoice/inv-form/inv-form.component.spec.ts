import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvFormComponent } from './inv-form.component';

describe('InvFormComponent', () => {
  let component: InvFormComponent;
  let fixture: ComponentFixture<InvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
