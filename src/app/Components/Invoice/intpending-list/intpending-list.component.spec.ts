import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntpendingListComponent } from './intpending-list.component';

describe('IntpendingListComponent', () => {
  let component: IntpendingListComponent;
  let fixture: ComponentFixture<IntpendingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntpendingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntpendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
