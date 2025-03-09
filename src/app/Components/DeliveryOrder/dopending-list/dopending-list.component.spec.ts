import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DopendingListComponent } from './dopending-list.component';

describe('DopendingListComponent', () => {
  let component: DopendingListComponent;
  let fixture: ComponentFixture<DopendingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DopendingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DopendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
