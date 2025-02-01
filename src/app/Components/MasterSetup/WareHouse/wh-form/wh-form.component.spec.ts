import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhFormComponent } from './wh-form.component';

describe('WhFormComponent', () => {
  let component: WhFormComponent;
  let fixture: ComponentFixture<WhFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
