import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegeionFormComponent } from './regeion-form.component';

describe('RegeionFormComponent', () => {
  let component: RegeionFormComponent;
  let fixture: ComponentFixture<RegeionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegeionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegeionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
