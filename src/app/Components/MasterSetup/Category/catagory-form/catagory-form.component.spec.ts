import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryFormComponent } from './catagory-form.component';

describe('CatagoryFormComponent', () => {
  let component: CatagoryFormComponent;
  let fixture: ComponentFixture<CatagoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatagoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatagoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
