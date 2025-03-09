import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrFormComponent } from './mr-form.component';

describe('MrFormComponent', () => {
  let component: MrFormComponent;
  let fixture: ComponentFixture<MrFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MrFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
